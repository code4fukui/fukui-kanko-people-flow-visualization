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
