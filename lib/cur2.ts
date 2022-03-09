import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class Cur2Stack extends Stack {
  public curName: string;
  public curs3: s3.IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    this.curName = this.node.tryGetContext('CurReportName');

    this.curs3 = s3.Bucket.fromBucketName(
      this,
      'Curs3',
      this.node.tryGetContext('CurBucketName'),
    );
  }
}
