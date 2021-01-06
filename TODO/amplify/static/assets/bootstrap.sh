#!/bin/bash

# Cloud9 Bootstrap Script
#
# 1. Installs homebrew
# 2. Upgrades to latest AWS CLI
# 3. Upgrades AWS SAM CLI
#
# Usually takes about 8 minutes to complete

set -euxo pipefail

ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
CURRENT_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'
export CDK_VERSION='1.59.0'

export INFOPATH="/home/linuxbrew/.linuxbrew/share/info"

function _logger() {
    echo -e "$(date) ${YELLOW}[*] $@ ${NC}"
}

function upgrade_sam_cli() {
    _logger "[+] Backing up current SAM CLI"
    cp $(which sam) ~/.sam_old_backup

    _logger "[+] Installing latest SAM CLI"
    # pipx install aws-sam-cli
    # cfn-lint currently clashing with SAM CLI deps
    ## installing SAM CLI via brew instead
    brew tap aws/tap
    brew install aws-sam-cli

    _logger "[+] Updating Cloud9 SAM binary"
    # Allows for local invoke within IDE (except debug run)
    ln -sf $(which sam) ~/.c9/bin/sam
}

function upgrade_existing_packages() {
    _logger "[+] Upgrading system packages"
    sudo yum update -y

    python3 -V
    # sudo update-alternatives --config python 
    
    _logger "[+] Upgrading Python pip and setuptools"
    python3 -m pip install --upgrade pip setuptools --user

    _logger "[+] Installing latest pip"
    # _logger "[+] Installing pipx, and latest AWS CLI"
    # python3 -m pip install --user pipx
    # pipx install awscli
    python3 -m pip install --upgrade --user awscli && hash -r

    _logger "[+] Installing latest AWS-CLI 2"
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
}

function upgrade_python() {
    _logger "[+] Upgrade Python 3.8"
    brew install python3
    echo 'alias python="python3.8"' >> ~/.bash_profile
    echo 'alias python3="python3.8"' >> ~/.bash_profile
    echo 'alias pip="pip3.8"' >> ~/.bash_profile
    echo 'alias pip3="pip3.8"' >> ~/.bash_profile
    
    # _logger "[+] Upgrade Python 3.8"
    # brew install pyenv
    # pyenv -v
    # pyenv install 3.8.3
    # sudo yum install libssl-dev openssl
    # wget https://www.python.org/ftp/python/3.8.3/Python-3.8.3.tgz
    # tar xzvf Python-3.8.3.tgz
    # cd Python-3.8.3
    # ./configure
    # make
    # sudo make install
    # cd ..
    # sudo rm -rf Python-3.8.3.tgz Python-3.8.3   
    # echo 'alias python="python3.8"' >> ~/.bash_profile
    # echo 'alias python3="python3.8"' >> ~/.bash_profile
    # echo 'alias pip="pip3.8"' >> ~/.bash_profile
    # echo 'alias pip3="pip3.8"' >> ~/.bash_profile
}

function upgrade_nodejs() {
    _logger "[+] Installing latest Node12 & TypeScript & CDK & CDK8s" 
    brew install node@12
    # sudo yum install -y gcc-c++ make
    # curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -
    # sudo yum install -y nodejs
    # nvm install lts/erbium
    # nvm use lts/erbium
    # nvm alias default lts/erbium
    # nvm uninstall lts/dubnium
    
    npm install -g yarn
    npm install -g typescript@latest
    npm install -g aws-cdk@${CDK_VERSION} --force
    # npx npm-check-updates -u
    npm i -g cdk8s-cli
    brew install aws/tap/copilot-cli
    node -v 
    npm -v 
}

function upgrade_ebs_storage() {
    _logger "[+] AMZ-Linux2/CenOS EBS Extending a Partition on a T2/T3 Instance"
    sudo file -s /dev/nvme?n*
    sudo growpart /dev/nvme0n1 1
    lsblk
    echo "Extend an ext2/ext3/ext4 file system"
    sudo yum install xfsprogs
    sudo resize2fs /dev/nvme0n1p1
    df -h
}

function install_utility_tools() {
    _logger "[+] Installing jq gettext bash-completion"
    sudo yum install -y jq gettext bash-completion
}

function install_linuxbrew() {
    _logger "[+] Creating touch symlink"
    sudo ln -sf /bin/touch /usr/bin/touch
    _logger "[+] Installing homebrew..."
    echo | sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
    _logger "[+] Adding homebrew in PATH"
    test -d ~/.linuxbrew && eval $(~/.linuxbrew/bin/brew shellenv)
    test -d /home/linuxbrew/.linuxbrew && eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
    test -r ~/.bash_profile && echo "eval \$($(brew --prefix)/bin/brew shellenv)" >>~/.bash_profile
    echo "eval \$($(brew --prefix)/bin/brew shellenv)" >>~/.profile
}

function install_kubernetes_tools() {
    KUBECTL_VERSION="1.17.7/2020-07-08"
    # AWS_IAM_AUTH_VERSION="1.17.7/2020-07-08"
    # PACKER_VERSION="3.4.4"
    # HELMSMAN_VERSION="3.4.4"

    _logger "[+] Install kubectl CLI (Kubernetes 1.17) from https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html"
    sudo curl --silent --location -o /usr/local/bin/kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/${KUBECTL_VERSION}/bin/linux/amd64/kubectl
    sudo chmod +x /usr/local/bin/kubectl
    kubectl version --short --client

    _logger "[+] Enable kubectl bash_completion"
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -F __start_kubectl k' >>~/.bash_profile

    _logger "[+] Install the Helm CLI"
    curl -sSL https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
    helm version --short

    _logger "[+] Stable Helm Chart Repository"
    helm repo add stable https://kubernetes-charts.storage.googleapis.com/
    helm search repo stable

    _logger "[+] Enable helm bash_completion"
    echo 'source <(helm completion bash)' >>~/.bash_profile
    echo 'alias h=helm' >>~/.bash_profile
    echo 'complete -F __start_helm h' >>~/.bash_profile

    # ## Install Helmsman
    # curl -L https://github.com/Praqma/helmsman/releases/download/v${HELMSMAN_VERSION}/helmsman_${HELMSMAN_VERSION}_linux_amd64.tar.gz | tar zx && \
    # chmod +x helmsman && \
    # mv ./helmsman /usr/local/bin/helmsman

    # ## Install aws-iam-authenticator
    # curl -o aws-iam-authenticator https://amazon-eks.s3.us-west-2.amazonaws.com/${AWS_IAM_AUTH_VERSION}/bin/linux/amd64/aws-iam-authenticator && \
    # chmod +x ./aws-iam-authenticator && \
    # mv ./aws-iam-authenticator /usr/local/bin/aws-iam-authenticator 

    _logger "[+] Installing ECS copilot ..."
    sudo curl -Lo /usr/local/bin/copilot https://github.com/aws/copilot-cli/releases/download/v0.1.0/copilot-linux-v0.1.0  \
    && sudo chmod +x /usr/local/bin/copilot \
    && copilot --help

    _logger "[+] Installing EKS K9s ..."
    K9S_VERSION=0.21.5
    K9S_TAR_FILENAME=k9s_$(uname -s)_$(uname -m).tar.gz
    curl -o /tmp/$K9S_TAR_FILENAME -L -k https://github.com/derailed/k9s/releases/download/v${K9S_VERSION}/$K9S_TAR_FILENAME
    tar -xvf /tmp/$K9S_TAR_FILENAME -C /tmp/
    sudo mv /tmp/k9s /usr/local/bin/k9s
    sudo chmod +x /usr/local/bin/k9s

    _logger "[+] Installing eksctl"
    brew tap weaveworks/tap 
    brew install kubernetes-cli kubernetes-helm weaveworks/tap/eksctl


    _logger "[+] Finished the install_kubernetes_tools!"
}

function verify_prerequisites_resources() {
    _logger "[+] Verify ACCOUNT_ID & AWS_REGION"
    export ACCOUNT_ID=$(aws sts get-caller-identity --output text --query Account)
    export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')
    export ROLE_NAME="admin-role"
    export CLUSTER_NAME="EKS-Cluster"
    test -n "$ACCOUNT_ID" && echo ACCOUNT_ID is "$ACCOUNT_ID" || echo ACCOUNT_ID is not set
    test -n "$AWS_REGION" && echo AWS_REGION is "$AWS_REGION" || echo AWS_REGION is not set
    test -n "$ROLE_NAME" && echo  ROLE_NAME  is "$ROLE_NAME"  || echo ROLE_NAME is not set

    _logger "[+] Save ACCOUNT_ID & AWS_REGION to .bash_profile"
    echo "export ACCOUNT_ID=${ACCOUNT_ID}" | tee -a ~/.bash_profile
    echo "export AWS_REGION=${AWS_REGION}" | tee -a ~/.bash_profile
    aws configure set default.region ${AWS_REGION}
    aws configure get default.region
    
    _logger "[+] Verify the binaries are in the path and executable" 
    for command in kubectl jq envsubst aws
    do
        which $command &>/dev/null && echo "[x] $command in path" || echo "[ ] $command NOT FOUND"
    done

    _logger "[+] Validate the IAM role admin-role"
    aws sts get-caller-identity --query Arn | grep admin-role -q && echo "IAM role valid" || echo "IAM role NOT valid"
}

function install_cdk_microservices_labs() {
    _logger "[+] install_cdk_microservices_labs"
    sudo yum update -y
    sudo yum remove -y java-1.7.0-openjdk && sudo yum install -y java-1.8.0-openjdk-devel
    
    git clone --recurse-submodules https://github.com/aws-samples/cdk-microservices-labs.git
}


function main() {
    # upgrade_ebs_storage
    install_linuxbrew
    
    upgrade_nodejs
    
    upgrade_python
    upgrade_existing_packages
    upgrade_sam_cli
    
    install_utility_tools
    install_kubernetes_tools

    verify_prerequisites_resources

    install_cdk_microservices_labs

    echo -e "${RED} [!!!!!!!!!] Open up a new terminal to reflect changes ${NC}"
    _logger "[+] Restarting Shell to reflect changes"
    exec ${SHELL}
}

main
