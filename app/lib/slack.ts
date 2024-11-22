import axios from 'axios';

const SLACK_WEBHOOK_URL =
  'https://hooks.slack.com/services/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';

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
