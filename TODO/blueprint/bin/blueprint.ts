#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { BlueprintStack } from '../lib/blueprint-stack';

const app = new cdk.App();
new BlueprintStack(app, 'BlueprintStack');
