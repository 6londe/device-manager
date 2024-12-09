import { PrismaClient } from '@prisma/client';
import config from '../../../config';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      include: {
        Heartbeat: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const currentTimestamp = new Date();

    const devicesWithStatus = devices.map((device: any) => {
      const latestHeartbeat = device.Heartbeat[0];
      const secSinceLastHeartbeat =
        latestHeartbeat && latestHeartbeat.timestamp
          ? Math.floor(
              (currentTimestamp.getTime() -
                new Date(latestHeartbeat.timestamp).getTime()) /
                1000
            )
          : null;

      const status =
        secSinceLastHeartbeat !== null &&
        secSinceLastHeartbeat * 1000 <= config.deviceOfflineStateThresholdMs
          ? 'online'
          : 'offline';

      return {
        id: device.id,
        deviceKey: device.deviceKey,
        nickname: device.nickname,
        status: status,
        notification: device.notification,
        timeSinceLastHeartbeat:
          secSinceLastHeartbeat !== null ? secSinceLastHeartbeat : null,
        lastHeartbeatDetails: latestHeartbeat
          ? {
              timestamp: latestHeartbeat.timestamp,
              tilt: latestHeartbeat.tilt,
              roll: latestHeartbeat.roll,
              batteryPercentage: latestHeartbeat.batteryPercentage,
              isCharging: latestHeartbeat.isCharging,
              screenImagePath: latestHeartbeat.screenImagePath,
            }
          : null,
      };
    });

    const sortedDevices = devicesWithStatus.sort((a: any, b: any) =>
      a.nickname.localeCompare(b.nickname)
    );

    return new Response(JSON.stringify(sortedDevices), { status: 200 });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch devices' }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceKey, notification } = body;

    if (deviceKey === undefined) {
      return new Response(JSON.stringify({ error: 'deviceKey is required' }), {
        status: 400,
      });
    }

    if (typeof notification !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'notification must be a boolean value' }),
        { status: 400 }
      );
    }

    const updatedDevice = await prisma.device.update({
      where: { deviceKey },
      data: { notification },
    });

    return new Response(JSON.stringify(updatedDevice), { status: 200 });
  } catch (error) {
    console.error('Error updating device notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update device notification' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
