import axios from 'axios';

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

export async function sendSlackMessage(message: string) {
  try {
    if (webhookUrl) {
      await axios.post(webhookUrl, {
        text: message,
      });
      console.log('Slack message sent');
    } else {
      console.log('Slack webhook url is missing');
    }
  } catch (error) {
    console.error('Failed to send slack message:', error);
  }
}
