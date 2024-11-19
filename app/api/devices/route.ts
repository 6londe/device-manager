import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ONLINE_MAX_SEC_SINCE_LAST_HEARTBEAT = 60;

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

    const devicesWithStatus = devices.map((device) => {
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
        secSinceLastHeartbeat <= ONLINE_MAX_SEC_SINCE_LAST_HEARTBEAT
          ? 'online'
          : 'offline';

      return {
        id: device.id,
        deviceKey: device.deviceKey,
        nickname: device.nickname,
        status: status,
        timeSinceLastHeartbeat:
          secSinceLastHeartbeat !== null ? secSinceLastHeartbeat : null,
        lastHeartbeatDetails: latestHeartbeat
          ? {
              timestamp: latestHeartbeat.timestamp,
              tilt: latestHeartbeat.tilt,
              batteryPercentage: latestHeartbeat.batteryPercentage,
              isCharging: latestHeartbeat.isCharging,
              currentScreen: latestHeartbeat.currentScreen,
            }
          : null,
      };
    });

    const sortedDevices = devicesWithStatus.sort((a, b) =>
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
