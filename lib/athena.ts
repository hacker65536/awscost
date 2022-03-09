import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_athena as athena } from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class AthenaStack extends Stack {
  public athenaworkgroup: athena.CfnWorkGroup;
  public athenaresults3: s3.Bucket;
  constructor(
    scope: Construct,
    id: string,
    report: string,
    props?: StackProps,
  ) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const database = report.split('-').join( '_');
    const workgroup = this.node.tryGetContext('AthenaWorkGroupName');

    this.athenaresults3 = new s3.Bucket(this, 'AWSCostAthenaQueryResults', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      versioned: true,
      // for hands on
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.athenaworkgroup = new athena.CfnWorkGroup(this, 'AthenaWorkGroup', {
      name: workgroup,

      // the properties below are optional
      description: 'awscost',
      // The option to delete a workgroup and its contents even if the workgroup contains any named queries.
      recursiveDeleteOption:true,
      state: 'ENABLED',
      workGroupConfiguration: {
        // 5GB
        bytesScannedCutoffPerQuery: 5368709120,
        enforceWorkGroupConfiguration: false,
        /*
        engineVersion: {
          effectiveEngineVersion: 'Auto',
          selectedEngineVersion: 'Auto',
        },
        */
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
          outputLocation: this.athenaresults3.s3UrlForObject(),
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

    const athenaworkgroup = this.athenaworkgroup.ref;
    // PreparedStatements

    // for analyze
    const itemTypeBySvcPreStm = new athena.CfnPreparedStatement(
      this,
      'ItemTypeBySvcPreStm',
      {
        statementName: 'awscost_item_type_by_svc_pre_stm',
        queryStatement: `
         SELECT line_item_line_item_type,
         floor(sum(line_item_blended_cost)) cost
         FROM ${database}
         WHERE line_item_product_code = ?
         and year =  ?
         and month = ?
         group by line_item_line_item_type
         order by cost desc
         limit 50
      `,

        // the properties below are optional
        description: 'line_item_type by svc prestm',
        workGroup: athenaworkgroup,
      },
    );

    const itemTypeBySvcNq = new athena.CfnNamedQuery(this, 'ItemTypeBySvcNq', {
      database: database,
      queryString: `
        EXECUTE  ${itemTypeBySvcPreStm.statementName}
        USING 
        'AmazonAthena',
        date_format(
          current_timestamp - interval '1' day,
          '%Y'
        ) ,
        -- %c Month, numeric (1 .. 12)
        date_format(
          current_timestamp - interval '1' day,
          '%c'
        ) 
        `,
      description: 'line_item_type by svc nq',
      name: 'awscost_item_type_by_svc_nq',
      workGroup: athenaworkgroup,
    });

    const usageTypeBySvcPreStm = new athena.CfnPreparedStatement(
      this,
      'UsageTypeBySvcPreStm',
      {
        statementName: 'awscost_usage_type_by_svc_pre_stm',
        queryStatement: `
         SELECT line_item_usage_type,
         floor(sum(line_item_blended_cost)) cost
         FROM ${database}
         WHERE line_item_product_code = ?
         and year =  ?
         and month = ?
         group by line_item_usage_type
         order by cost desc
         limit 50
      `,
        description: 'usage_type by svc prestm',
        workGroup: athenaworkgroup,
      },
    );

    const usageTypeBySvcNq = new athena.CfnNamedQuery(
      this,
      'UsageTypeBySvcNq',
      {
        database: database,
        queryString: `
        EXECUTE  ${usageTypeBySvcPreStm.statementName}
        USING 
        'AmazonAthena',
        date_format(
          current_timestamp - interval '1' day,
          '%Y'
        ) ,
        -- %c Month, numeric (1 .. 12)
        date_format(
          current_timestamp - interval '1' day,
          '%c'
        ) 
        `,
        description: 'usage_type by svc nq',
        name: 'awscost_usage_type_by_svc_nq',
        workGroup: athenaworkgroup,
      },
    );

    // monthly services
    const monthlyCostByServicePreStm = new athena.CfnPreparedStatement(
      this,
      'monthlyCostByServicePreStm',
      {
        statementName: 'awscost_monthly_cost_by_svc_pre_stm',
        queryStatement: `
         SELECT product_product_name,line_item_product_code,
         floor(sum(line_item_blended_cost)) cost
         FROM ${database}
         WHERE year =  ?
         and month = ?
         group by product_product_name,line_item_product_code
         order by cost desc
         limit 50
      `,
        description: 'montly cost by service prestm',
        workGroup: athenaworkgroup,
      },
    );

    const monthlyCostByServiceNq = new athena.CfnNamedQuery(
      this,
      'MonthlyCostByServiceNq',
      {
        database: database,
        queryString: `
        EXECUTE  ${monthlyCostByServicePreStm.statementName}
        USING 
        date_format(
          current_timestamp - interval '1' day,
          '%Y'
        ) ,
        -- %c Month, numeric (1 .. 12)
        date_format(
          current_timestamp - interval '1' day,
          '%c'
        ) 
        `,
        description: 'monthly cost by svc nq',
        name: 'awscost_monthly_cost_by_svc_nq',
        workGroup: athenaworkgroup,
      },
    );

    // daily services
    const dailyCostByServicePreStm = new athena.CfnPreparedStatement(
      this,
      'dailyCostByServicePreStm',
      {
        statementName: 'awscost_daily_cost_by_svc_pre_stm',
        queryStatement: `
         SELECT line_item_product_code,
         floor(sum(line_item_blended_cost)) cost
         FROM ${database}
         WHERE year =  ?
         and month = ?
         group by line_item_product_code
         order by cost desc
         limit 50
      `,
        description: 'daily cost by service prestm',
        workGroup: athenaworkgroup,
      },
    );

    const dailyCostByServiceNq = new athena.CfnNamedQuery(
      this,
      'dailyCostByServiceNq',
      {
        database: database,
        queryString: `
        EXECUTE  ${dailyCostByServicePreStm.statementName}
        USING 
        date_format(
          current_timestamp - interval '1' day,
          '%Y'
        ) ,
        -- %c dai, numeric (1 .. 12)
        date_format(
          current_timestamp - interval '1' day,
          '%c'
        ) 
        `,
        description: 'daily cost by svc nq',
        name: 'awscost_daily_cost_by_svc_nq',
        workGroup: athenaworkgroup,
      },
    );

    // output
    new cdk.CfnOutput(this, 'QueryCli01ListPreStm', {
      value: `aws athena list-prepared-statements --work-group ${athenaworkgroup}  --query 'PreparedStatements[*].[StatementName]' --output text`,
    });
    new cdk.CfnOutput(this, 'QueryCli02GetPreStm', {
      value: `aws athena get-prepared-statement --statement-name $(pbpaste) --query 'PreparedStatement.[StatementName,QueryStatement]' --work-group ${athenaworkgroup} --output text`,
    });
    new cdk.CfnOutput(this, 'QueryCli03ListNamedQuery', {
      value: `aws athena list-named-queries --work-group ${athenaworkgroup}`,
    });
    new cdk.CfnOutput(this, 'QueryCli04GetNamedQuery', {
      value: `aws athena get-named-query  --named-query-id $(pbpaste) --query 'NamedQuery.[Name,NamedQueryId,QueryString]' --output text`,
    });
  }
}
