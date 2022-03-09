import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_quicksight as quicksight } from 'aws-cdk-lib';

export class QuickSightStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const awsAccountId = process.env.CDK_DEFAULT_ACCOUNT!;
    const curs3 = 's3bucketname';
    const manifest = '/keyprefix/menifest.json';
    const qsUser =
      'arn:aws:quicksight:us-east-1:123456789012:user/default/quicksightuser';

    const cfnDataSource = new quicksight.CfnDataSource(
      this,
      'MyCfnDataSource',
      /* all optional props */ {
        /*
        alternateDataSourceParameters: [
          {
            s3Parameters: {
              manifestFileLocation: {
              bucket: curs3,
              key:manifest,
              },
            },
          },
        ],
        */
        awsAccountId: awsAccountId,
        /*
      credentials: {
        copySourceArn: 'copySourceArn',
        credentialPair: {
          password: 'password',
          username: 'username',
    
          // the properties below are optional
          alternateDataSourceParameters: [{
            s3Parameters: {
              manifestFileLocation: {
                bucket: 'bucket',
                key: 'key',
              },
            },
          }],
        },
      },
      */
        dataSourceId: 'dataSourceId',
        dataSourceParameters: {
          s3Parameters: {
            manifestFileLocation: {
              bucket: curs3,
              key: manifest,
            },
          },
        },
        /*
        errorInfo: {
          message: 'message',
          type: 'type',
        },
        */
        name: 'mydatasource',
        permissions: [
          {
            principal: qsUser,
            actions: [
              'quicksight:UpdateDataSourcePermissions',
              'quicksight:DescribeDataSource',
              'quicksight:DescribeDataSourcePermissions',
              'quicksight:PassDataSource',
              'quicksight:UpdateDataSource',
              'quicksight:DeleteDataSource',
            ],
          },
        ],
        /*
        sslProperties: {
          disableSsl: false,
        },
        */
        /*
        tags: [
          {
            key: 'key',
            value: 'value',
          },
        ],
        */
        type: 'S3',
        /*
        vpcConnectionProperties: {
          vpcConnectionArn: 'vpcConnectionArn',
        },
        */
      },
    );

    const cfnDataSet = new quicksight.CfnDataSet(
      this,
      'MyCfnDataSet',
      /* all optional props */ {
        awsAccountId: process.env.CDK_DEFAULT_ACCOUNT!,
        /*
        columnGroups: [
          {
            geoSpatialColumnGroup: {
              columns: ['columns'],
              name: 'name',

              // the properties below are optional
              countryCode: 'countryCode',
            },
          },
        ],
        */
        /*
        columnLevelPermissionRules: [
          {
            columnNames: ['columnNames'],
            principals: ['principals'],
          },
        ],
        */
        dataSetId: 'dataSetId',
        /*
        fieldFolders: {
          fieldFoldersKey: {
            columns: ['columns'],
            description: 'description',
          },
        },
        */
        // SPICE | DIRECT_QUERY
        importMode: 'SPICE',
        /*
        ingestionWaitPolicy: {
          ingestionWaitTimeInHours: 123,
          waitForSpiceIngestion: false,
        },
        */
        logicalTableMap: {
          logicalTableMapKey: {
            alias: 'mydatasource1',
            source: {
              /*
              joinInstruction: {
                leftOperand: 'leftOperand',
                onClause: 'onClause',
                rightOperand: 'rightOperand',
                type: 'type',

                // the properties below are optional
                leftJoinKeyProperties: {
                  uniqueKey: false,
                },
                rightJoinKeyProperties: {
                  uniqueKey: false,
                },
              },
              */
              physicalTableId: 'physicalTableMapKey',
            },

            // the properties below are optional
            dataTransforms: [
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-1',
                  newColumnName: 'identity/LineItemId',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-2',
                  newColumnName: 'identity/TimeInterval',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-3',
                  newColumnName: 'bill/InvoiceId',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-4',
                  newColumnName: 'bill/InvoicingEntity',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-5',
                  newColumnName: 'bill/BillingEntity',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-6',
                  newColumnName: 'bill/BillType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-7',
                  newColumnName: 'bill/PayerAccountId',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'bill/PayerAccountId',
                  newColumnType: 'INTEGER',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-8',
                  newColumnName: 'bill/BillingPeriodStartDate',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'bill/BillingPeriodStartDate',
                  newColumnType: 'DATETIME',
                  format: "yyyy-MM-dd'T'HH:mm:ssZZ",
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-9',
                  newColumnName: 'bill/BillingPeriodEndDate',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'bill/BillingPeriodEndDate',
                  newColumnType: 'DATETIME',
                  format: "yyyy-MM-dd'T'HH:mm:ssZZ",
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-10',
                  newColumnName: 'lineItem/UsageAccountId',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'lineItem/UsageAccountId',
                  newColumnType: 'INTEGER',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-11',
                  newColumnName: 'lineItem/LineItemType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-12',
                  newColumnName: 'lineItem/UsageStartDate',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'lineItem/UsageStartDate',
                  newColumnType: 'DATETIME',
                  format: "yyyy-MM-dd'T'HH:mm:ssZZ",
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-13',
                  newColumnName: 'lineItem/UsageEndDate',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'lineItem/UsageEndDate',
                  newColumnType: 'DATETIME',
                  format: "yyyy-MM-dd'T'HH:mm:ssZZ",
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-14',
                  newColumnName: 'lineItem/ProductCode',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-15',
                  newColumnName: 'lineItem/UsageType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-16',
                  newColumnName: 'lineItem/Operation',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-17',
                  newColumnName: 'lineItem/AvailabilityZone',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-18',
                  newColumnName: 'lineItem/ResourceId',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-19',
                  newColumnName: 'lineItem/UsageAmount',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'lineItem/UsageAmount',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-20',
                  newColumnName: 'lineItem/NormalizationFactor',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-21',
                  newColumnName: 'lineItem/NormalizedUsageAmount',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-22',
                  newColumnName: 'lineItem/CurrencyCode',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-23',
                  newColumnName: 'lineItem/UnblendedRate',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'lineItem/UnblendedRate',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-24',
                  newColumnName: 'lineItem/UnblendedCost',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'lineItem/UnblendedCost',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-25',
                  newColumnName: 'lineItem/BlendedRate',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'lineItem/BlendedRate',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-26',
                  newColumnName: 'lineItem/BlendedCost',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'lineItem/BlendedCost',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-27',
                  newColumnName: 'lineItem/LineItemDescription',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-28',
                  newColumnName: 'lineItem/TaxType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-29',
                  newColumnName: 'lineItem/LegalEntity',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-30',
                  newColumnName: 'product/ProductName',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-31',
                  newColumnName: 'product/availability',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'product/availability',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-32',
                  newColumnName: 'product/description',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-33',
                  newColumnName: 'product/durability',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'product/durability',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-34',
                  newColumnName: 'product/freeQueryTypes',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-35',
                  newColumnName: 'product/fromLocation',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-36',
                  newColumnName: 'product/fromLocationType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-37',
                  newColumnName: 'product/fromRegionCode',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-38',
                  newColumnName: 'product/group',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-39',
                  newColumnName: 'product/groupDescription',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-40',
                  newColumnName: 'product/location',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-41',
                  newColumnName: 'product/locationType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-42',
                  newColumnName: 'product/logsDestination',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-43',
                  newColumnName: 'product/maxIopsBurstPerformance',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-44',
                  newColumnName: 'product/maxIopsvolume',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-45',
                  newColumnName: 'product/maxThroughputvolume',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-46',
                  newColumnName: 'product/maxVolumeSize',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-47',
                  newColumnName: 'product/operation',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-48',
                  newColumnName: 'product/platopricingtype',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-49',
                  newColumnName: 'product/platovolumetype',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-50',
                  newColumnName: 'product/productFamily',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-51',
                  newColumnName: 'product/region',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-52',
                  newColumnName: 'product/regionCode',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-53',
                  newColumnName: 'product/servicecode',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-54',
                  newColumnName: 'product/servicename',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-55',
                  newColumnName: 'product/sku',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-56',
                  newColumnName: 'product/storageClass',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-57',
                  newColumnName: 'product/storageMedia',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-58',
                  newColumnName: 'product/toLocation',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-59',
                  newColumnName: 'product/toLocationType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-60',
                  newColumnName: 'product/transferType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-61',
                  newColumnName: 'product/usagetype',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-62',
                  newColumnName: 'product/version',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-63',
                  newColumnName: 'product/volumeApiName',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-64',
                  newColumnName: 'product/volumeType',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-65',
                  newColumnName: 'pricing/RateCode',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-66',
                  newColumnName: 'pricing/RateId',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'pricing/RateId',
                  newColumnType: 'INTEGER',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-67',
                  newColumnName: 'pricing/currency',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-68',
                  newColumnName: 'pricing/publicOnDemandCost',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'pricing/publicOnDemandCost',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-69',
                  newColumnName: 'pricing/publicOnDemandRate',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'pricing/publicOnDemandRate',
                  newColumnType: 'DECIMAL',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-70',
                  newColumnName: 'pricing/term',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-71',
                  newColumnName: 'pricing/unit',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-72',
                  newColumnName: 'reservation/AmortizedUpfrontCostForUsage',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-73',
                  newColumnName:
                    'reservation/AmortizedUpfrontFeeForBillingPeriod',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-74',
                  newColumnName: 'reservation/EffectiveCost',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-75',
                  newColumnName: 'reservation/EndTime',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-76',
                  newColumnName: 'reservation/ModificationStatus',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-77',
                  newColumnName: 'reservation/NormalizedUnitsPerReservation',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-78',
                  newColumnName: 'reservation/NumberOfReservations',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-79',
                  newColumnName: 'reservation/RecurringFeeForUsage',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-80',
                  newColumnName: 'reservation/StartTime',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-81',
                  newColumnName: 'reservation/SubscriptionId',
                },
              },
              {
                castColumnTypeOperation: {
                  columnName: 'reservation/SubscriptionId',
                  newColumnType: 'INTEGER',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-82',
                  newColumnName: 'reservation/TotalReservedNormalizedUnits',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-83',
                  newColumnName: 'reservation/TotalReservedUnits',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-84',
                  newColumnName: 'reservation/UnitsPerReservation',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-85',
                  newColumnName:
                    'reservation/UnusedAmortizedUpfrontFeeForBillingPeriod',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-86',
                  newColumnName: 'reservation/UnusedNormalizedUnitQuantity',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-87',
                  newColumnName: 'reservation/UnusedQuantity',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-88',
                  newColumnName: 'reservation/UnusedRecurringFee',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-89',
                  newColumnName: 'reservation/UpfrontValue',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-90',
                  newColumnName: 'savingsPlan/TotalCommitmentToDate',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-91',
                  newColumnName: 'savingsPlan/SavingsPlanARN',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-92',
                  newColumnName: 'savingsPlan/SavingsPlanRate',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-93',
                  newColumnName: 'savingsPlan/UsedCommitment',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-94',
                  newColumnName: 'savingsPlan/SavingsPlanEffectiveCost',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-95',
                  newColumnName:
                    'savingsPlan/AmortizedUpfrontCommitmentForBillingPeriod',
                },
              },
              {
                renameColumnOperation: {
                  columnName: 'ColumnId-96',
                  newColumnName:
                    'savingsPlan/RecurringCommitmentForBillingPeriod',
                },
              },
              {
                projectOperation: {
                  projectedColumns: [
                    'identity/LineItemId',
                    'identity/TimeInterval',
                    'bill/InvoiceId',
                    'bill/InvoicingEntity',
                    'bill/BillingEntity',
                    'bill/BillType',
                    'bill/PayerAccountId',
                    'bill/BillingPeriodStartDate',
                    'bill/BillingPeriodEndDate',
                    'lineItem/UsageAccountId',
                    'lineItem/LineItemType',
                    'lineItem/UsageStartDate',
                    'lineItem/UsageEndDate',
                    'lineItem/ProductCode',
                    'lineItem/UsageType',
                    'lineItem/Operation',
                    'lineItem/AvailabilityZone',
                    'lineItem/ResourceId',
                    'lineItem/UsageAmount',
                    'lineItem/NormalizationFactor',
                    'lineItem/NormalizedUsageAmount',
                    'lineItem/CurrencyCode',
                    'lineItem/UnblendedRate',
                    'lineItem/UnblendedCost',
                    'lineItem/BlendedRate',
                    'lineItem/BlendedCost',
                    'lineItem/LineItemDescription',
                    'lineItem/TaxType',
                    'lineItem/LegalEntity',
                    'product/ProductName',
                    'product/availability',
                    'product/description',
                    'product/durability',
                    'product/freeQueryTypes',
                    'product/fromLocation',
                    'product/fromLocationType',
                    'product/fromRegionCode',
                    'product/group',
                    'product/groupDescription',
                    'product/location',
                    'product/locationType',
                    'product/logsDestination',
                    'product/maxIopsBurstPerformance',
                    'product/maxIopsvolume',
                    'product/maxThroughputvolume',
                    'product/maxVolumeSize',
                    'product/operation',
                    'product/platopricingtype',
                    'product/platovolumetype',
                    'product/productFamily',
                    'product/region',
                    'product/regionCode',
                    'product/servicecode',
                    'product/servicename',
                    'product/sku',
                    'product/storageClass',
                    'product/storageMedia',
                    'product/toLocation',
                    'product/toLocationType',
                    'product/transferType',
                    'product/usagetype',
                    'product/version',
                    'product/volumeApiName',
                    'product/volumeType',
                    'pricing/RateCode',
                    'pricing/RateId',
                    'pricing/currency',
                    'pricing/publicOnDemandCost',
                    'pricing/publicOnDemandRate',
                    'pricing/term',
                    'pricing/unit',
                    'reservation/AmortizedUpfrontCostForUsage',
                    'reservation/AmortizedUpfrontFeeForBillingPeriod',
                    'reservation/EffectiveCost',
                    'reservation/EndTime',
                    'reservation/ModificationStatus',
                    'reservation/NormalizedUnitsPerReservation',
                    'reservation/NumberOfReservations',
                    'reservation/RecurringFeeForUsage',
                    'reservation/StartTime',
                    'reservation/SubscriptionId',
                    'reservation/TotalReservedNormalizedUnits',
                    'reservation/TotalReservedUnits',
                    'reservation/UnitsPerReservation',
                    'reservation/UnusedAmortizedUpfrontFeeForBillingPeriod',
                    'reservation/UnusedNormalizedUnitQuantity',
                    'reservation/UnusedQuantity',
                    'reservation/UnusedRecurringFee',
                    'reservation/UpfrontValue',
                    'savingsPlan/TotalCommitmentToDate',
                    'savingsPlan/SavingsPlanARN',
                    'savingsPlan/SavingsPlanRate',
                    'savingsPlan/UsedCommitment',
                    'savingsPlan/SavingsPlanEffectiveCost',
                    'savingsPlan/AmortizedUpfrontCommitmentForBillingPeriod',
                    'savingsPlan/RecurringCommitmentForBillingPeriod',
                  ],
                },
              },
            ],
          },
        },
        name: 'awscostdataset',
        permissions: [
          {
            principal:
              'arn:aws:quicksight:us-east-1:393139287410:user/default/go',
            actions: [
              'quicksight:UpdateDataSetPermissions',
              'quicksight:DescribeDataSet',
              'quicksight:DescribeDataSetPermissions',
              'quicksight:PassDataSet',
              'quicksight:DescribeIngestion',
              'quicksight:ListIngestions',
              'quicksight:UpdateDataSet',
              'quicksight:DeleteDataSet',
              'quicksight:CreateIngestion',
              'quicksight:CancelIngestion',
            ],
          },
        ],
        physicalTableMap: {
          physicalTableMapKey: {
            s3Source: {
              dataSourceArn: cfnDataSource.attrArn,
              inputColumns: [
                {
                  name: 'ColumnId-1',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-2',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-3',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-4',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-5',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-6',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-7',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-8',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-9',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-10',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-11',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-12',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-13',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-14',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-15',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-16',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-17',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-18',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-19',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-20',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-21',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-22',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-23',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-24',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-25',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-26',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-27',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-28',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-29',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-30',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-31',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-32',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-33',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-34',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-35',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-36',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-37',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-38',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-39',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-40',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-41',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-42',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-43',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-44',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-45',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-46',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-47',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-48',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-49',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-50',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-51',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-52',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-53',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-54',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-55',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-56',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-57',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-58',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-59',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-60',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-61',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-62',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-63',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-64',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-65',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-66',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-67',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-68',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-69',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-70',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-71',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-72',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-73',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-74',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-75',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-76',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-77',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-78',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-79',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-80',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-81',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-82',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-83',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-84',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-85',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-86',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-87',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-88',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-89',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-90',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-91',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-92',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-93',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-94',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-95',
                  type: 'STRING',
                },
                {
                  name: 'ColumnId-96',
                  type: 'STRING',
                },
              ],

              // the properties below are optional
              uploadSettings: {
                containsHeader: true,
                delimiter: ',',
                format: 'CSV',
                startFromRow: 1,
                textQualifier: 'DOUBLE_QUOTE',
              },
            },
          },
        },
        /*
        rowLevelPermissionDataSet: {
          arn: 'arn',
          permissionPolicy: 'permissionPolicy',

          // the properties below are optional
          formatVersion: 'formatVersion',
          namespace: 'namespace',
        },
        */
        /*
        tags: [
          {
            key: 'key',
            value: 'value',
          },
        ],
        */
      },
    );

    const cfnTemplate = new quicksight.CfnTemplate(this, 'MyCfnTemplate', {
      awsAccountId: awsAccountId,
      sourceEntity: {
        sourceTemplate: {
          arn: 'arn',
        },
      },
      templateId: 'templateId',

      // the properties below are optional
      name: 'mytemplate',
      permissions: [
        {
          actions: [
            'quicksight:UpdateTemplatePermissions',
            'quicksight:DescribeTemplate',
          ],
          principal: qsUser,
        },
      ],
      tags: [
        {
          key: 'key',
          value: 'value',
        },
      ],
      versionDescription: 'versionDescription',
    });

    /*
    const cfnAnalysis = new quicksight.CfnAnalysis(this, 'MyCfnAnalysis', {
      analysisId: 'analysisId',
      awsAccountId: process.env.CDK_DEFAULT_ACCOUNT!,
      sourceEntity: {
        sourceTemplate: {
          arn: 'arn',
          dataSetReferences: [
            {
              dataSetArn: cfnDataSet.attrArn,
              dataSetPlaceholder: 'dataSetPlaceholder',
            },
          ],
        },
      },

      name: 'qstest',
      permissions: [
        {
          actions: [
            'quicksight:RestoreAnalysis',
            'quicksight:UpdateAnalysisPermissions',
            'quicksight:DeleteAnalysis',
            'quicksight:DescribeAnalysisPermissions',
            'quicksight:QueryAnalysis',
            'quicksight:DescribeAnalysis',
            'quicksight:UpdateAnalysis',
          ],
          principal:
                qsUser, 
        },
      ],
      tags: [
        {
          key: 'key',
          value: 'value',
        },
      ],
      themeArn: 'themeArn',
    });
    */
  }
}
