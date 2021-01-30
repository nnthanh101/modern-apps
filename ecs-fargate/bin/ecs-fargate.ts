#!/usr/bin/env node 
import * as cdk from "@aws-cdk/core"; 
import { RootStack }  from "../lib/root-stack";
 
const process = require('process');

const app = new cdk.App();
new RootStack(app, 'EcsRootStack');
 