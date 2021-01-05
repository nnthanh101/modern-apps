#!/bin/bash

echo "Installing Utilities: jq, nano ..."
sudo yum -y update
sudo yum -y upgrade
sudo yum install -y nano jq

echo "Upgrade lts/erbium nodejs12.x & Installing CDK ..."
# nvm install lts/erbium
# nvm use lts/erbium
# nvm alias default lts/erbium
# nvm uninstall v10.23.0
#
npm update && npm update -g
sudo npm install -g aws-cdk

# echo "Installing Docker ..."
# sudo amazon-linux-extras uninstall docker
# sudo service docker start
# sudo usermod -a -G docker ec2-user

echo "[x] Verify AWS CLI": $(aws  --version)
echo "[x] Verify jq":      $(jq   --version)
echo "[x] Verify nano":    $(nano --version)
echo "[x] Verify Docker":  $(docker version)
# echo "[x] Verify nvm":     $(nvm ls)
echo "[x] Verify Node.js": $(node --version)
echo "[x] Verify CDK":     $(cdk  --version)
echo "[x] Verify Python":  $(python -V)
echo "[x] Verify Python3":  $(python3 -V)
