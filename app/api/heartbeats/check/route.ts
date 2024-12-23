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
      if (!device.notification) return;

      const [latest, previous] = device.Heartbeat;
      if (!latest) return;

      const issues: string[] = [];

      // check pitch
      if (
        previous &&
        Math.abs(Number(latest.pitch) - Number(previous.pitch)) >=
          config.notificationConditions.minPitchChange
      ) {
        issues.push(
          `Pitch value changed (Previous: ${previous.pitch}, Current: ${latest.pitch})`
        );
      }

      // check roll
      if (
        previous &&
        Math.abs(Number(latest.roll) - Number(previous.roll)) >=
          config.notificationConditions.minRollChange
      ) {
        issues.push(
          `Roll value changed (Previous: ${previous.roll}, Current: ${latest.roll})`
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
          `Device has been offline (${latest.timestamp.toISOString()})`
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
        if (latest.batteryPercentage < 90) {
          issues.push(`Device is not charging`);
        }
      }

      if (issues.length > 0) {
        messages.push(
          `${device.nickname} (${device.deviceKey})\n- ${issues.join('\n- ')}`
        );
      }
    });

    if (messages.length > 0) {
      const message = `Issues detected:\n\n${messages.join('\n\n')}`;
      await sendSlackMessage(message);
    }

    console.log(`${messages.length} issues detected and sent to slack`);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return new Response('Error occurred', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
