#!/bin/bash

####################
#    variables
####################
# shellcheck disable=SC2034
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
MAGENTA='\033[35m'
CYAN='\033[36m'
WHITE='\033[37m'
GRAY='\033[38;5;244m'
RESET='\033[0m'

ERASE_LINE='\033[2K'
HIDE_CURSOR='\033[?25l'
SHOW_CURSOR='\033[?25h'

####################
#    functions
####################
function checkDependencies() {
  status=0

  # aws-cliが未インストールならインストールを促す
  if ! command -v aws 2>&1 >/dev/null; then
    echo -e "${RED}ERROR:${RESET}\taws-cliがインストールされていません。\n\t以下の手順に沿ってインストールしてください。\n"
    cat <<EOF
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

$(echo -e "${GRAY}")参考: https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html$(echo -e "${RESET}")

EOF
    status=1
  fi

  # jqが未インストールならインストールを促す
  if ! command -v jq 2>&1 >/dev/null; then
    echo -e "${RED}ERROR:${RESET}\tjqがインストールされていません。\n\t以下の手順に沿ってインストールしてください。\n"
    cat <<EOF
brew install jq

EOF
    status=1
  fi

  return $status
}

function spinner() {
	local i=0
	local spin='⠧⠏⠛⠹⠼⠶'
	local n=${#spin}

  # 一度だけカーソルを隠し、TERM/INTでクリーンに終了
  printf "%b" "${HIDE_CURSOR}"
  trap 'printf "%b\r%b" "${ERASE_LINE}" "${SHOW_CURSOR}"; exit 0' TERM INT HUP

	while true; do
		sleep 0.1
		printf "%b" "${ERASE_LINE}"
		printf "%b %b" "${GREEN}${spin:i++%n:1}${RESET}" "$*"
		printf "\r"
	done
}

# 実行時間計測（スクリプト開始からの経過秒を自動カウント）
_report_duration() {
  local t=$SECONDS
  local h=$((t/3600))
  local m=$(((t%3600)/60))
  local s=$((t%60))
  # 既存のカラー出力に合わせて echo -e を使用
  echo -e "${CYAN}INFO:${RESET}\t実行時間: $(printf '%02d:%02d:%02d' "$h" "$m" "$s")"
}
