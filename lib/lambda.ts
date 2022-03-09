import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_cur as cur } from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib';
import { aws_lambda_nodejs as lambdajs } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_secretsmanager as secretsmanager } from 'aws-cdk-lib';
import { aws_athena as athena } from 'aws-cdk-lib';

export class LambdaStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    workgroup: athena.CfnWorkGroup,
    athenaResultS3: s3.Bucket,
    curS3: s3.IBucket,
    CurName: string,
    props?: StackProps,
  ) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const fn = new lambdajs.NodejsFunction(this, 'NodeLambda', {
      entry: 'src/lambda/notifyfn/index.ts',
      handler: 'handler',
      bundling: {
        //minify: true,
        sourcesContent: false,
        externalModules: ['chart.js'],
      },
      timeout: cdk.Duration.minutes(3),
    });

    const secret = new secretsmanager.Secret(this, 'SlackSecrets');
    secret.grantRead(fn.role!);

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['athena:*'],
        resources: [
          `arn:aws:athena:${process.env.CDK_DEFAULT_REGION}:${process.env.CDK_DEFAULT_ACCOUNT}:workgroup/${workgroup.ref}`,
        ],
      }),
    );

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['glue:GetTable', 'glue:GetDatabase', 'glue:GetPartition'],
        resources: ['*'],
      }),
    );

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3:Get*', 's3:List*'],
        resources: [`${curS3.bucketArn}`, `${curS3.bucketArn}/*`],
      }),
    );

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3:*'],
        resources: [
          `${athenaResultS3.bucketArn}`,
          `${athenaResultS3.bucketArn}/*`,
        ],
      }),
    );

    fn.addEnvironment('SECRETID', secret.secretArn);
    fn.addEnvironment('ATHENAWORKGROUP', workgroup.ref);
    const table = CurName.split('-').join('_');
    const database = `athenacurcfn_${table}`;
    fn.addEnvironment('DATABASE',database);

    new CfnOutput(this, 'SecCli01PutSec', {
      value: `aws secretsmanager put-secret-value --secret-id ${secret.secretArn} --secret-string file://mysec.json`,
    });

    new CfnOutput(this, 'SecCli02GetSec', {
      value: `aws secretsmanager get-secret-value --secret-id ${secret.secretArn} --query 'SecretString' | jq -r | jq '.'`,
    });

    new CfnOutput(this, 'LocalInvoke', {
      value: `cdk synth LambdaStack && sam local invoke -t ./cdk.out/LambdaStack.template.json -n env.json ${this.resolve((fn.node.defaultChild as cdk.CfnElement).logicalId)}`
    });

  }
}
