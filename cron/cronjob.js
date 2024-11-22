import axios from 'axios';
import config from '../config';

async function checkHeartbeatNotificationConditions() {
  try {
    const response = await axios.get(
      'http://localhost:3000/api/heartbeats/check'
    );
    console.log('check notification conditions:', response.data);
  } catch (error) {
    console.error('failed to check notification conditions:', error.message);

    // This will trigger Docker's restart policy
    process.exit(1);
  }
}

setInterval(
  checkHeartbeatNotificationConditions,
  config.notificationConditionCheckIntervalMin * 60 * 1000
);
