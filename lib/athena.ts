import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_athena as athena } from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class AthenaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const awsCostAthenaS3 = new s3.Bucket(this, 'AWSCostAthenaQueryResults', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      versioned: true,
      // for hands on
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const athenaWorkGroup = new athena.CfnWorkGroup(this, 'AthenaWorkGroup', {
      name: 'o11y-awscost',

      // the properties below are optional
      description: 'awscost',
      recursiveDeleteOption: false,
      state: 'ENABLED',
      workGroupConfiguration: {
        // 5GB
        bytesScannedCutoffPerQuery: 5368709120,
        enforceWorkGroupConfiguration: false,
        engineVersion: {
          effectiveEngineVersion: 'Auto',
          selectedEngineVersion: 'Auto',
        },
        publishCloudWatchMetricsEnabled: true,
        requesterPaysEnabled: false,
        resultConfiguration: {
          /*
          encryptionConfiguration: {
            encryptionOption: 'encryptionOption',

            // the properties below are optional
            kmsKey: 'kmsKey',
          },
          */
          outputLocation: awsCostAthenaS3.s3UrlForObject(),
        },
      },
      /*
      workGroupConfigurationUpdates: {
        bytesScannedCutoffPerQuery: 123,
        enforceWorkGroupConfiguration: false,
        engineVersion: {
          effectiveEngineVersion: 'effectiveEngineVersion',
          selectedEngineVersion: 'selectedEngineVersion',
        },
        publishCloudWatchMetricsEnabled: false,
        removeBytesScannedCutoffPerQuery: false,
        requesterPaysEnabled: false,
        resultConfigurationUpdates: {
          encryptionConfiguration: {
            encryptionOption: 'encryptionOption',

            // the properties below are optional
            kmsKey: 'kmsKey',
          },
          outputLocation: 'outputLocation',
          removeEncryptionConfiguration: false,
          removeOutputLocation: false,
        },
      },
      */
    });
  }
}
