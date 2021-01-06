#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EksStack } from '../lib/eks-stack';
import { PipelineStack } from '../lib/pipeline_stack';

const app = new cdk.App();

// const evn = new cdk.Environment();
const eks = new EksStack(app, 'eks');
new PipelineStack(app, 'pipeline', { 
        eksCluster: eks.eksCluster, 
        redisCluster: eks.redisCluster,
        rds: eks.rds
    }
);