import { PrismaClient } from '@prisma/client';

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

    const devicesWithLastHeartbeat = devices.map((device) => {
      const latestHeartbeat = device.Heartbeat[0];
      const lastHeartbeat =
        latestHeartbeat && latestHeartbeat.timestamp
          ? Math.floor(
              (currentTimestamp.getTime() -
                new Date(latestHeartbeat.timestamp).getTime()) /
                1000
            )
          : null;

      return {
        id: device.id,
        deviceKey: device.deviceKey,
        nickname: device.nickname,
        lastHeartbeat: lastHeartbeat !== null ? lastHeartbeat : null,
      };
    });

    const sortedDevices = devicesWithLastHeartbeat.sort((a, b) =>
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
