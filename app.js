const { App, ExpressReceiver } = require('@slack/bolt');
const awsServerlessExpress = require('aws-serverless-express');
const requestType = require('./lib/requesttype');

// Initialize Slack receiver
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // The `processBeforeResponse` option is required for all FaaS environments.
  // It allows Bolt methods (e.g. `app.message`) to handle a Slack request
  // before the Bolt framework responds to the request (e.g. `ack()`). This is
  // important because FaaS immediately terminate handlers after the response.
  processBeforeResponse: true
});

// Initializes app with bot token and the AWS Lambda ready receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver
});

// Initialize your AWSServerlessExpress server using Bolt's ExpressReceiver
const server = awsServerlessExpress.createServer(expressReceiver.app);

// Generate response from request type metadata
async function generateResponse (requestType) {
 let response = { 
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": requestType.name,
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": requestType.description
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Go to raise a ticket",
            "emoji": true
          },
          "value": "raise_ticket",
          "url": requestType.url,
          "action_id": "raise_ticket"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Knowledge Base:*"
        }
      },
      {
        "type": "divider"
      },
    ]
  };

  let referenceList = ""
  requestType.references.forEach(reference =>
    referenceList += `<${reference.url}|${reference.title}>\n`
  );

  response.blocks.push (
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": referenceList
      }
    }
  );

  return response;
};

// Generate help list from request type metadata
async function generateHelpList () {
  let helpList = {
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey there! please let me know what you are after. \nSo I can send you to the right place.`
        },
        "accessory": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Hi Bot, I would like to ...",
            "emoji": true
          },
          "options": [
          ],
          "action_id": "help_list"
        }
      }
    ]
  };

  for (const [type, data] of Object.entries(requestType)) {
    helpList.blocks[0].accessory.options.push (
      {
        "text": {
          "type": "plain_text",
          "text": data.name,
          "emoji": true
        },
        "value": type,
      }
    )
  };

  return helpList;
};

// Listens to incoming messages that may ask help
app.message(/(help|favour|assistance)/i, async ({ message, say }) => {
  console.log(`${message.user} asked for help`)
  await say (await generateHelpList());
});

// Listens for an action from a help dropdown list button click
app.action('help_list', async ({ body, ack, client }) => {
  console.log(`${body.user.name} clicked ${body.actions[0].selected_option.value}`);
  const response = await generateResponse(requestType[body.actions[0].selected_option.value])
  let requestInfo = {
    trigger_id: body.trigger_id,
  };
  let requestView = {
    type: 'modal',
    callback_id: 'help_list',
    title: {
      type: 'plain_text',
      text: 'Help'
    }
  }
  Object.assign(requestView, response)
  requestInfo.view = requestView
  await client.views.open(requestInfo);
  await ack();
});

// Acknowledge the raise_ticket action
app.action('raise_ticket', async ({ ack }) => {
  await ack();
});

// Listens to incoming messages that is related to direct connect, vpc endpoints
app.message(/(direct connect|vpc endpoint)/i, async ({ message, say }) => {
  await say(await generateResponse(requestType.migrate_to_transit_gateway))
});

// Listens to incoming messages that is related to firewall
app.message(/(firewall)/i, async ({ message, say }) => {
  await say(await generateResponse(requestType.request_firewall_change))
});

app.error((error) => {
  console.error(error);
});  

// Handle the Lambda function event
module.exports.handler = (event, context) => {
  console.log('⚡️ Bolt app is running!');
  awsServerlessExpress.proxy(server, event, context);
};