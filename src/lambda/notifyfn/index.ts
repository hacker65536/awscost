import { Handler } from 'aws-lambda';
import { WebClient } from '@slack/web-api';
import { Athena, SecretsManager } from 'aws-sdk';
import { slackTable } from './slacktable';
//import { registerFont,createCanvas } from 'canvas'

type EmptyHandler = Handler<void, string>;

export const handler: EmptyHandler = async function (event: any) {
  // get value from secretmanager
  const secretid = process.env.SECRETID;
  const secret = new SecretsManager();
  const secval = await secret
    .getSecretValue({
      SecretId: secretid!,
    })
    .promise();
  const secobj = JSON.parse(secval.SecretString!);
  const token = secobj.token;
  const channel = secobj.channel;

  // create date
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const mon = currentTime.getMonth() + 1;
  // athena
  const athena = new Athena();

  const q = `
  EXECUTE awscost_monthly_cost_by_svc_pre_stm USING
  '${year}',
  '${mon}'
    `;
  const wg = process.env.ATHENAWORKGROUP;
  const qid = await athena
    .startQueryExecution({
      QueryString: q,
      WorkGroup: wg,
      QueryExecutionContext: {
        Catalog: 'awsdatacatalog',
        Database: process.env.DATABASE,
      },
    })
    .promise();

  console.log(qid);

  // wait until query execution is doneo
  const retry = 10;
  var count = 1;
  for (let i = 0; i < retry; i++) {
    let qstatus = await athena
      .getQueryExecution({
        QueryExecutionId: qid.QueryExecutionId!,
      })
      .promise();

    if (qstatus.QueryExecution?.Status?.State == 'SUCCEEDED') {
      break;
    }
    if (qstatus.QueryExecution?.Status?.State == 'FAILED') {
      return (
        'queryexecution is FAILED\n' +
        qstatus.QueryExecution.Status.StateChangeReason
      );
    }

    await new Promise((resolve) => setTimeout(resolve, count * 1000));
    console.log('wait ' + count + 's');
    count += i;
  }

  const output = await athena
    .getQueryResults({
      QueryExecutionId: qid.QueryExecutionId!,
    })
    .promise();
  //console.log(JSON.stringify(output));

  console.log(JSON.stringify(output.ResultSet?.Rows));

  const tbltmp = {
    title: `${year}/${mon} month cost report`,
    columns: [{}],
    dataSource: [{}],
  };

  var col1 = '';
  var col2 = '';
  var col3 = '';
  output.ResultSet?.Rows?.some((v, k) => {
    if (k == 0) {
      tbltmp.columns[0] = {
        width: 40,
        title: v.Data![0].VarCharValue,
        dataIndex: v.Data![0].VarCharValue,
      };
      tbltmp.columns[1] = {
        width: 20,
        title: v.Data![1].VarCharValue,
        dataIndex: v.Data![1].VarCharValue,
      };
      tbltmp.columns[2] = {
        width: 20,
        title: v.Data![2].VarCharValue,
        dataIndex: v.Data![2].VarCharValue,
        align: 'right',
      };
      col1 = v.Data![0].VarCharValue!;
      col2 = v.Data![1].VarCharValue!;
      col3 = v.Data![2].VarCharValue!;
    } else {
      tbltmp.dataSource[k - 1] = {
        [col1]: v.Data![0].VarCharValue,
        [col2]: v.Data![1].VarCharValue,
        [col3]: v.Data![2].VarCharValue,
      };
    }

    // top 30
    if (k > 30) {
      return true;
    }
  });

  tbltmp.dataSource.unshift('-');


  // put to slack
  const tbl = slackTable(tbltmp);
  const client = new WebClient(token);
  const text = tbl;
  // https://api.slack.com/docs/rate-limits#rate-limits__rtm-apis__posting-messages
  // Clients should limit messages sent to channels to 4000 character
  //console.log(text.length) 
  const response = await client.chat.postMessage({ channel, text });

  return String(response)

};
