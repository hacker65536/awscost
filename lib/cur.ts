import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_cur as cur } from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib';

export class CurStack extends Stack {
  public curName: string;
  public curs3: s3.IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    this.curs3 = new s3.Bucket(this, 'curs3', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      versioned: true,
      // for hands on
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.curs3.addToResourcePolicy(
      new iam.PolicyStatement({
        principals: [new iam.ServicePrincipal('billingreports.amazonaws.com')],
        actions: ['s3:GetBucketAcl', 's3:GetBucketPolicy'],
        resources: [this.curs3.bucketArn],
      }),
    );
    this.curs3.addToResourcePolicy(
      new iam.PolicyStatement({
        principals: [new iam.ServicePrincipal('billingreports.amazonaws.com')],
        actions: ['s3:PutObject'],
        resources: [`${this.curs3.bucketArn}/*`],
      }),
    );
    this.curName = this.node.tryGetContext('CurReportName');

    const athenaReport = new cur.CfnReportDefinition(
      this,
      'CfnReportDefinition',
      {
        // ZIP | GZIP | Parquet
        compression: 'Parquet',
        // textORcsv | Parquet
        format: 'Parquet',
        refreshClosedReports: true,
        reportName: this.curName,
        // CREATE_NEW_REPORT | OVERWRITE_REPORT
        reportVersioning: 'OVERWRITE_REPORT',
        s3Bucket: this.curs3.bucketName,
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

    const qsReport = new cur.CfnReportDefinition(
      this,
      'CfnReportDefinitionQS',
      {
        // ZIP | GZIP | Parquet
        compression: 'GZIP',
        // textORcsv | Parquet
        format: 'textORcsv',
        refreshClosedReports: true,
        reportName: this.curName + '-qs',
        // CREATE_NEW_REPORT | OVERWRITE_REPORT
        reportVersioning: 'OVERWRITE_REPORT',
        s3Bucket: this.curs3.bucketName,
        s3Prefix: 'quicksight',
        s3Region: this.region!,
        // HOURLY | DAILY | MONTHLY
        timeUnit: 'HOURLY',

        // the properties below are optional
        // REDSHIFT | QUICKSIGHT | ATHENA
        additionalArtifacts: ['QUICKSIGHT'],
        // RESOURCES
        additionalSchemaElements: ['RESOURCES'],
        //billingViewArn: 'billingViewArn',
      },
    );
  }
}
