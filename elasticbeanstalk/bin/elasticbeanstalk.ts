#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../lib/vpc-stack';
import {RDSMySQLStack} from '../lib/rds-stack';
import {EBStack} from '../lib/eb-stack';
import { envVars } from '../lib/config';
import { env } from 'process';
const app = new cdk.App();

new VpcStack(app, 'vpc');


const rdsmysql =  new RDSMySQLStack(app, 'rdsmysql', {
    rdsInstanceName: envVars.RDS_INSTANCE_NAME
    , rdsCredentiallUser: envVars.RDS_CREDENTIAL_USERNAME
    , rdsCredentialPass: envVars.RDS_CREDENTIAL_PAWSSWORD
    , rdsDatabaseName: envVars.RDS_DATABASE_NAME
    , env: {
        account: process.env.AWS_ACCOUNT_ID, 
        region: process.env.AWS_REGION,
    }
});

new EBStack(app, 'eb', {
    jdbcConnectioin:rdsmysql.jdbcConnection
    , jdbcUser:envVars.RDS_CREDENTIAL_USERNAME
    , jdbcPassword:envVars.RDS_CREDENTIAL_PAWSSWORD
    , env: {
        account: process.env.AWS_ACCOUNT_ID, 
        region: process.env.AWS_REGION,
    }
});
