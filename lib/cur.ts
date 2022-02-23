import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_cur as cur } from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib';

export class CurStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const curs3 = new s3.Bucket(this, 'curs3', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      versioned: true,
      // for hands on
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    curs3.addToResourcePolicy(
      new iam.PolicyStatement({
        principals: [new iam.ServicePrincipal('billingreports.amazonaws.com')],
        actions: ['s3:GetBucketAcl', 's3:GetBucketPolicy'],
        resources: [curs3.bucketArn],
      }),
    );
    curs3.addToResourcePolicy(
      new iam.PolicyStatement({
        principals: [new iam.ServicePrincipal('billingreports.amazonaws.com')],
        actions: ['s3:PutObject'],
        resources: [`${curs3.bucketArn}/*`],
      }),
    );
    const reportName = this.node.tryGetContext('CurReportName');
    const cfnReportDefinition = new cur.CfnReportDefinition(
      this,
      'CfnReportDefinition',
      {
        // ZIP | GZIP | Parquet
        compression: 'Parquet',
        // textORcsv | Parquet
        format: 'Parquet',
        refreshClosedReports: true,
        reportName: reportName,
        // CREATE_NEW_REPORT | OVERWRITE_REPORT
        reportVersioning: 'OVERWRITE_REPORT',
        s3Bucket: curs3.bucketName,
        s3Prefix: 'athena',
        s3Region: this.region!,
        // HOURLY | DAILY | MONTHLY
        timeUnit: 'HOURLY',

        // the properties below are optional
        // REDSHIFT | QUICKSIGHT | ATHENA
        additionalArtifacts: ['ATHENA'],
        // RESOURCES
        additionalSchemaElements: ['RESOURCES'],
        //billingViewArn: 'billingViewArn',
      },
    );
  }
}
