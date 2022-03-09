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
  const currentTime=new Date()
  const year= currentTime.getFullYear()
  const mon = currentTime.getMonth()+1
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
        Database: 'athenacurcfn_o11y2022_cur',
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
  output.ResultSet?.Rows?.forEach((v, k) => {
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
      tbltmp.dataSource[k-1] = {
        [col1]: v.Data![0].VarCharValue,
        [col2]: v.Data![1].VarCharValue,
        [col3]: v.Data![2].VarCharValue,
      };
    }
  });
  tbltmp.dataSource.unshift("-")

  console.log(JSON.stringify(tbltmp))

  // put to slack

  const tbl=slackTable(tbltmp)
  /*
  const tbl = slackTable({
    title: 'Marketing Summary',
    columns: [
      { width: 20, title: 'Campaign', dataIndex: 'campaign' },
      { width: 12, title: 'Cost', dataIndex: 'cost', align: 'right' },
    ],
    dataSource: [
      '-',
      { campaign: 'Google CPC', cost: '$ 400' },
      { campaign: 'Facebook CPC', cost: '$ 60' },
      { campaign: 'Youtube Video', cost: '$ 1,230' },
      '-',
      { campaign: 'Total', cost: '$ 1,690' },
    ],
  });
  */
  const client = new WebClient(token);
  //const text = '*Hello World*';
  const text = tbl;

  const response = await client.chat.postMessage({ channel, text });

  // 投稿に成功すると `ok` フィールドに `true` が入る。

  return String(secobj.token);
  //return String(res);

  /*
  const athena = new Athena();
  const output = await athena
    .getQueryResults({
      QueryExecutionId: '8ca66ae0-3f31-4f25-aa87-0f13dc214feb',
    })
    .promise();
  console.log(output);
  output.ResultSet?.Rows?.forEach((v) => {
    v.Data;
  });
  */

  /*
  registerFont(__dirname.concat('/fonts/DejaVuSans.ttf'), { family: 'DejaVu Sans' });


    let canvas = createCanvas(300, 300);
    var ctxCircle = canvas.getContext('2d');
    var X = canvas.width / 2;
    var Y = canvas.height / 2;
    var R = 45;
    ctxCircle.beginPath();
    ctxCircle.arc(X, Y, R, 0, 2 * Math.PI, false);
    ctxCircle.lineWidth = 3;
    ctxCircle.strokeStyle = '#FF9900';
    ctxCircle.stroke();

    var ctxText = canvas.getContext('2d');
    ctxText.font = '40px "DejaVu Sans"';
    ctxText.fillStyle = '#146EB4';
    ctxText.fillText('DejaVu Sans', 15, 120);

    const response1 = {
        statusCode: 200,
        body: JSON.stringify(canvas.toDataURL()),
    };
    */

  //return String(JSON.stringify(output.ResultSet?.Rows));
  // return String(response1);
};
