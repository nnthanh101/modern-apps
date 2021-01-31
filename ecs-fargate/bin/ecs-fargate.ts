#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { EcsFargateStack } from "../lib/ecs-fargate";
 
const app = new cdk.App();
new EcsFargateStack(app, 'EcsFargateStack');