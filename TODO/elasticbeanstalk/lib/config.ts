const chalk = require('chalk');
require('dotenv').config();

export const envVars = {
  ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
  REGION:process.env.AWS_REGION,
  BUCKET_NAME: process.env.BUCKET_NAME || 'billservice-source1',
  VPC_NAME_DEVELOPMENT: process.env.AWS_VPC_NAME_DEVELOPMENT || 'development',
  VPC_NAME_MANAGEMENT: process.env.AWS_VPC_NAME_MANAGEMENT || 'management',
  VPC_NAME_PRODUCTION: process.env.AWS_VPC_NAME_PRODUCTION || 'production',
  VPC_CIDR: process.env.AWS_VPC_CIDR,
  VPC_ISOLATED_CIDRMASK: parseInt(process.env.AWS_VPC_ISOLATED_CIDRMASK||''),
  VPC_PUBLIC_CIDRMASK: parseInt(process.env.AWS_VPC_PUBLIC_CIDRMASK||''),
  VPC_PRIVATE_CIDRMASK: parseInt(process.env.AWS_VPC_PRIVATE_CIDRMASK||''),
  RDS_DATABASE_NAME:process.env.AWS_RDS_DATABASE_NAME||'',
  RDS_INSTANCE_NAME: process.env.AWS_RDS_INSTANCE_NAME||'',
  RDS_CREDENTIAL_USERNAME: process.env.AWS_RDS_CREDENTIAL_USERNAME||'',
  RDS_CREDENTIAL_PAWSSWORD: process.env.AWS_RDS_CREDENTIAL_PAWSSWORD||'',
  EB_APP_NAME:process.env.AWS_EB_APP_NAME||''
  
  // you can change this to the branch of your choice (currently main)
  // BUILD_BRANCH: process.env.BUILD_BRANCH || '^refs/heads/main$',
};

export function validateEnvVariables() {
  console.log('Your port is ${process.env.BUCKET_NAME}'); // undefined
  // for (let variable in envVars) {
  //   if (!envVars[variable as keyof typeof envVars])
  //     throw Error(
  //       chalk.red(`Environment variable ${variable} is not defined!`)
  //     );
  // }
}

// npm i --force -g aws-cdk