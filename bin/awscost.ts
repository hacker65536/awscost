#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
//import { AwscostStack } from '../lib/awscost-stack';
import { CurStack } from '../lib/cur';
import { Cur2Stack } from '../lib/cur2';
import { AthenaStack } from '../lib/athena';
//import { QuickSightStack } from '../lib/quicksight';
import { LambdaStack } from '../lib/lambda';

const app = new cdk.App();
const defenv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

//new AwscostStack(app, 'AwscostStack', {
/* If you don't specify 'env', this stack will be environment-agnostic.
 * Account/Region-dependent features and context lookups will not work,
 * but a single synthesized template can be deployed anywhere. */
/* Uncomment the next line to specialize this stack for the AWS Account
 * and Region that are implied by the current CLI configuration. */
// env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
/* Uncomment the next line if you know exactly what Account and Region you
 * want to deploy the stack to. */
// env: { account: '123456789012', region: 'us-east-1' },
/* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
//});

/*
const cur = new CurStack(app, 'CurStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
});
*/

const cur = new Cur2Stack(app, 'CurStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
});

const athena = new AthenaStack(app, 'AthenaStack', cur.curName, {
  env: defenv,
});

/*
const qs = new QuickSightStack(app, 'QuickSightStack', {
  env: defenv,
});
*/

const lambda = new LambdaStack(
  app,
  'LambdaStack',
  athena.athenaworkgroup,
  athena.athenaresults3,
  cur.curS3,
  cur.curName,
  {
    env: defenv,
  },
);
