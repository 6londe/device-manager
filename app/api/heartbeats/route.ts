import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      deviceKey,
      nickname,
      tilt,
      batteryPercentage,
      isCharging,
      currentScreen,
      appState,
    } = await request.json();

    if (!deviceKey) {
      return new Response(JSON.stringify({ error: 'deviceKey is required' }), {
        status: 400,
      });
    }

    if (
      batteryPercentage !== undefined &&
      (batteryPercentage < 0 || batteryPercentage > 100)
    ) {
      return new Response(
        JSON.stringify({
          error: 'batteryPercentage must be between 0 and 100',
        }),
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx: any) => {
      let device = await tx.device.findUnique({
        where: { deviceKey },
      });

      if (!device) {
        device = await tx.device.create({
          data: { deviceKey, nickname: nickname || deviceKey },
        });
      }

      const heartbeat = await tx.heartbeat.create({
        data: {
          deviceId: device.id,
          timestamp: new Date(),
          tilt: tilt || 'unknown',
          batteryPercentage:
            batteryPercentage !== undefined ? batteryPercentage : 0,
          isCharging: isCharging !== undefined ? isCharging : false,
          currentScreen: currentScreen || 'unknown',
          appState: appState || 0,
        },
      });

      return { device, heartbeat };
    });

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error('Error processing heartbeat:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process heartbeat' }),
      { status: 500 }
    );
  }
}
