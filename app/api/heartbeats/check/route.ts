import { PrismaClient } from '@prisma/client';
import { sendSlackMessage } from '@/app/lib/slack';
import config from '../../../../config';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      include: {
        Heartbeat: {
          orderBy: { timestamp: 'desc' },
          take: 2,
        },
      },
    });

    const messages: string[] = [];

    devices.forEach((device: any) => {
      const [latest, previous] = device.Heartbeat;

      if (!latest) return;

      const issues: string[] = [];

      // check tilt
      if (
        previous &&
        Math.abs(Number(latest.tilt) - Number(previous.tilt)) >= 10
      ) {
        issues.push(
          `Tilt changed by 10 or more (Previous: ${previous.tilt}, Current: ${latest.tilt})`
        );
      }

      // check offline
      if (
        new Date(latest.timestamp) <
        new Date(
          Date.now() - config.notificationConditions.minOfflineDurationMs
        )
      ) {
        issues.push(
          `Device has been offline for more than 2 minutes (Timestamp: ${latest.timestamp.toISOString()})`
        );
      }

      // check battery percentage
      if (
        latest.batteryPercentage <=
        config.notificationConditions.minBatteryPercentage
      ) {
        issues.push(
          `Battery percentage is ${config.notificationConditions.minBatteryPercentage}% or less (${latest.batteryPercentage}%)`
        );
      }

      // check charging
      if (!latest.isCharging) {
        issues.push(`Device is not charging`);
      }

      if (issues.length > 0) {
        messages.push(
          `Device ID: ${device.id}, Device Key: ${
            device.deviceKey
          }\n- ${issues.join('\n- ')}`
        );
      }
    });

    if (messages.length > 0) {
      const message = `Issues detected:\n\n${messages.join('\n\n')}`;
      await sendSlackMessage(message);
    }

    return new Response('OK', {
      status: 200,
    });
  } catch (error) {
    console.error('Error occured:', error);
    return new Response('Error occurred', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
