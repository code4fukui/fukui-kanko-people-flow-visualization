#!/bin/bash
dirs=("./packages/fukui-terminal" "./packages/tojinbo" "./packages/rainbow-line" "./packages/whole" "./packages/landing-page")

# gitリポジトリの直下に移動
cd "$(git rev-parse --show-toplevel)" || exit 1
source ./tools/utils.sh

# spinner を必ず止めて見た目を戻す
cleanup_spinner() {
  if [[ -n "${spinner_pid:-}" ]] && kill -0 "$spinner_pid" 2>/dev/null; then
    kill "$spinner_pid" >/dev/null 2>&1
    wait "$spinner_pid" 2>/dev/null
    printf "%b\r%b" "$ERASE_LINE" "$SHOW_CURSOR"
  fi
}

on_exit() {
  cleanup_spinner
  _report_duration
}

trap on_exit EXIT
trap 'cleanup_spinner; exit 130' INT

DATA_STAGE="data-fkpfv"

####################
#       main
####################
# 依存のインストール状況を確認
if ! checkDependencies; then
  echo -e "\n${GRAY}エンターキーを押して終了。${RESET}"
  exit 1
fi

# CIではセットアップをスキップする
if [ "${GITHUB_ACTIONS}" != "true" ]; then
  # .env.profileがなければセットアップする
  if [ ! -e ".env.profile" ]; then
    # aws-cliに複数プロファイルがあれば選択肢を、1つであればセットアップ済みのものをセット
    # 未設定なら終了する
    profiles=$(aws configure list-profiles)
    if [ "$(echo "$profiles" | wc -l)" -gt 1 ]; then
      echo -e "${GREEN}SETUP:${RESET}\taws-cliに設定済みのプロファイルが複数見つかりました。\n\tこのプロジェクトで利用するプロファイルを選択してください。"
      select profile in $profiles; do
        echo -e "${CYAN}INFO:${RESET}\t$profile をこのプロジェクトで利用するプロファイルに指定します。"
        echo "AWS_PROFILE=$profile" >> ./.env.profile
        break
      done
    elif [ "$(echo "$profiles" | wc -l)" -eq 1 ]; then
      echo -e "${CYAN}INFO:${RESET}\t$profiles をこのプロジェクトで利用するプロファイルに指定します。"
      echo "AWS_PROFILE=$profiles" >> ./.env.profile
      profile=$profiles
    else
      echo -e "${RED}ERROR:${RESET}\taws-cliに設定済みのプロファイルがありません。aws configure を実行してプロファイルを作成してください。"
      echo -e "\n${GRAY}エンターキーを押して終了。${RESET}"
      exit 1
    fi
    AWS_PROFILE=$profile
  else
    # 設定済みの.envを読み込み
    set -a; source .env.profile; set +a
  fi

  # .env.awsがなければセットアップする
  if [ ! -e ".env.aws" ]; then
    buckets=$(aws s3 ls | awk '{print $3}')
    if [ "$(echo "$buckets" | wc -l)" -gt 1 ]; then
      echo -e "${GREEN}SETUP:${RESET}\tS3バケットが複数見つかりました。\n\tこのプロジェクトで利用するバケットを選択してください。"
      select bucket in $buckets; do
        echo -e "${CYAN}INFO:${RESET}\t$bucket をこのプロジェクトで利用するバケットに指定します。"
        break
      done
    elif [ "$(echo "$buckets" | wc -l)" -eq 1 ]; then
      echo -e "${CYAN}INFO:${RESET}\t$buckets をこのプロジェクトで利用するバケットに指定します。"
      bucket=$buckets
    else
      echo -e "${RED}ERROR:${RESET}\t作成済みのバケットがありません。"
      echo -e "\n${GRAY}エンターキーを押して終了。${RESET}"
      exit 1
    fi

    distributions=$(aws cloudfront list-distributions | jq -r ".DistributionList.Items[].Id")
    if [ "$(echo "$distributions" | wc -l)" -gt 1 ]; then
      echo -e "${GREEN}SETUP:${RESET}\tCloudFrontディストリビューションが複数見つかりました。\n\tこのプロジェクトで利用するディストリビューションを選択してください。"
      select distribution in $distributions; do
        echo -e "${CYAN}INFO:${RESET}\t$distribution をこのプロジェクトで利用するディストリビューションに指定します。"
        break
      done
    elif [ "$(echo "$distributions" | wc -l)" -eq 1 ]; then
      echo -e "${CYAN}INFO:${RESET}\t$distributions をこのプロジェクトで利用するディストリビューションに指定します。"
      distribution=$distributions
    else
      echo -e "${RED}ERROR:${RESET}\t作成済みのディストリビューションがありません。"
      echo -e "\n${GRAY}エンターキーを押して終了。${RESET}"
      exit 1
    fi

    regions=$(aws ec2 describe-regions | jq -r ".Regions[].RegionName")
    echo -e "${GREEN}SETUP:${RESET}\tこのプロジェクトで利用するAWSリージョンを選択してください。"
    select region in $regions; do
      echo -e "${CYAN}INFO:${RESET}\t$region をこのプロジェクトで利用するAWSリージョンに指定します。"
      break
    done

    echo -e "BUCKET=$bucket\nDISTRIBUTION=$distribution\nREGION=$region" >> ./.env.aws
    BUCKET=$bucket
    DISTRIBUTION=$distribution
    REGION=$region
  else
    # 設定済みの.envを読み込み
    set -a; source .env.aws; set +a
  fi

  if [ ! -e ".env" ]; then
    echo -e "${GREEN}SETUP:${RESET}\tこのプロジェクトで利用する内部オリジンを指定してください。"
    read -r internal_origin
    echo -e "INTERNAL_ORIGIN=${internal_origin}\n" > .env
  fi
  set -a; source .env; set +a
fi

if
  [[ ( "${GITHUB_ACTIONS}" = "true" ) && ( ( -z "${AWS_ACCESS_KEY_ID}" ) || ( -z "${AWS_SECRET_ACCESS_KEY}" ) ) ]] ||
  [[ ( "${GITHUB_ACTIONS}" != "true" ) && ( -z "${AWS_PROFILE}" ) ]] ||
  [ -z "${BUCKET}" ] ||
  [ -z "${DISTRIBUTION}" ] ||
  [ -z "${REGION}" ]
then
  echo -e "${RED}ERROR:${RESET}\t必要な情報が登録されていません。"
  if [ "${GITHUB_ACTIONS}" != "true" ]; then
    echo -e "\t.env.profile, .env.awsを削除して再度実行しセットアップしてください。"
  fi
  echo -e "\n${GRAY}エンターキーを押して終了。${RESET}"
  exit 1
fi

# 引数をパースしてデプロイ先のステージ名を設定
while getopts "n:d" opt; do
  case $opt in
    n) STAGE_NAME="$OPTARG";;
    d) DRY="true";;
    *) echo "Usage: $0 -n stage_name"; exit 0 ;;
  esac
done
if [ -z "$STAGE_NAME" ]; then
  echo -e "${RED}ERROR:${RESET}\tステージ名が指定されていません。-n オプションで指定してください。"
  exit 1
fi
echo -e "${CYAN}INFO:${RESET}\t"

if [ "${STAGE_NAME}" != "${DATA_STAGE}" ]; then
  # ビルド
  echo -e "${CYAN}INFO:${RESET}\tビルド開始"
  export INTERNAL_ROOT="https://${DATA_STAGE}.${INTERNAL_ORIGIN}"
  pnpm build
  echo -e "${CYAN}INFO:${RESET}\tビルド完了"

  # ビルド結果を確認
  missing_dirs=()
  for dir in "${dirs[@]}"; do
    if [ ! -d "$dir" ]; then
      missing_dirs+=("$dir")
    fi
  done
  if [ ${#missing_dirs[@]} -ne 0 ]; then
    echo -e "${RED}ERROR:${RESET}\tビルド結果が不足しています。 ${missing_dirs[*]}"
    exit 1
  fi
else
  echo -e "${CYAN}INFO:${RESET}\tデータをs3にアップロードします。"
fi

# ビルド結果をまとめる
echo -e "${CYAN}INFO:${RESET}\tアップロードするファイルをまとめます"
spinner "\tアップロード準備中..." &
spinner_pid=$!
rm -rf ./dist
mkdir -p "./dist/$STAGE_NAME"
if [ "$STAGE_NAME" != "$DATA_STAGE" ]; then
  for dir in "${dirs[@]}"; do
    package="${dir##*/}"
    if [ "$dir" == "./packages/landing-page" ]; then
      cp -r "$dir"/dist/* ./dist/"$STAGE_NAME"/
    else
      cp -r "$dir"/dist ./dist/"$STAGE_NAME"/"$package"
    fi
  done
else
  # .gitなどが含まれないようにfindでコピー
  mkdir -p ./dist/data
  find ./data -mindepth 1 -maxdepth 1 ! -name '.*' -exec cp -r {} ./dist/"$STAGE_NAME"/data/ \;
fi
kill $spinner_pid > /dev/null 2>&1
wait $spinner_pid 2> /dev/null
printf "%b%b\n" "$ERASE_LINE" "${CYAN}INFO:${RESET}\tアップロード準備完了。"
printf "%b\r" "${SHOW_CURSOR}"

# aws cli でアップロードする
echo -e "${CYAN}INFO:${RESET}\taws cliによってビルド結果を s3://$BUCKET/$STAGE_NAME にアップロードします。"
if [ "$DRY" != "true" ]; then
  spinner "\tアップロード中..." &
  spinner_pid=$!
  # S3にアップロード
  aws s3 sync "./dist/$STAGE_NAME/" "s3://$BUCKET/$STAGE_NAME/" --delete --cache-control "max-age=0" --region "$REGION" > /dev/null 2>&1
  kill $spinner_pid > /dev/null 2>&1
  wait $spinner_pid 2> /dev/null
  printf "%b%b\n" "$ERASE_LINE"  "${CYAN}INFO:${RESET}\tアップロード完了。"
  printf "%b\r" "${SHOW_CURSOR}"
else
  echo -e "${GRAY}dryrun${RESET}"
fi

# aws cli でcloudfrontのキャッシュを削除する
echo -e "${CYAN}INFO:${RESET}\tAWS CloudFront のキャッシュ削除を予約します。"
if [ "$DRY" != "true" ]; then
  aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION" --paths "/*" > /dev/null 2>&1
else
  echo -e "${GRAY}dryrun${RESET}"
fi
echo -e "${CYAN}INFO:${RESET}\tキャッシュ削除の予約完了。"

echo -e "${CYAN}INFO:${RESET}\tデプロイ完了\n"
