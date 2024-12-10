import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: any) {
  try {
    const { deviceKey } = await params;

    if (!deviceKey) {
      return new Response(JSON.stringify({ error: 'deviceKey is required' }), {
        status: 400,
      });
    }

    await prisma.heartbeat.deleteMany({
      where: { Device: { deviceKey: deviceKey } },
    });

    const deletedDevice = await prisma.device.delete({
      where: { deviceKey: deviceKey },
    });

    return new Response(JSON.stringify(deletedDevice), { status: 200 });
  } catch (error) {
    console.error('Error deleting device:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete device' }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
