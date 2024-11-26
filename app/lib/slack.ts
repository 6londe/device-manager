import config from '@/config';
import axios from 'axios';

const SLACK_WEBHOOK_URL = config.slackWebhookUrl;

export async function sendSlackMessage(message: string) {
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message,
    });
    console.log('Slack message sent');
  } catch (error) {
    console.error('Failed to send slack message:', error);
  }
}
