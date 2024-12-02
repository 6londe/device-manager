import { NextResponse } from 'next/server';
import { join } from 'path';
import { promises as fs } from 'fs';

export async function GET(req: Request, { params }: any) {
  const { file } = await params;
  const filePath = join(process.cwd(), 'public/files', file);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('File not found:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
