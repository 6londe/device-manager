import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const deviceKey = formData.get('deviceKey')?.toString();
    const nickname = formData.get('nickname')?.toString();
    const tilt = formData.get('tilt')?.toString() || 'unknown';
    const batteryPercentage = formData.get('batteryPercentage')?.toString();
    const isCharging = formData.get('isCharging')?.toString() === 'true';
    const appState = formData.get('appState')?.toString();

    if (!deviceKey) {
      return new Response(JSON.stringify({ error: 'deviceKey is required' }), {
        status: 400,
      });
    }

    if (
      batteryPercentage !== undefined &&
      (Number(batteryPercentage) < 0 || Number(batteryPercentage) > 100)
    ) {
      return new Response(
        JSON.stringify({
          error: 'batteryPercentage must be between 0 and 100',
        }),
        { status: 400 }
      );
    }

    let screenImagePath = null;
    const screenImage = formData.get('screenImage') as File | null;

    if (screenImage) {
      const uploadDir = 'public/screens';
      await fs.mkdir(uploadDir, { recursive: true });

      const newFileName = `${deviceKey}${path.extname(screenImage.name)}`;
      const filePath = path.join(uploadDir, newFileName);

      const fileBuffer = await screenImage.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(fileBuffer));
      screenImagePath = filePath.replace(/^public\//, '');
    }

    const result = await prisma.$transaction(async (tx) => {
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
          tilt,
          batteryPercentage: batteryPercentage ? Number(batteryPercentage) : 0,
          isCharging,
          screenImagePath,
          appState: appState ? Number(appState) : 0,
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
