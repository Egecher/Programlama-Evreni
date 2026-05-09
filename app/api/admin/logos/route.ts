import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logoDirectory = path.join(process.cwd(), 'public/images/logo');
    const files = fs.readdirSync(logoDirectory);
    const logos = files.filter(file => /\.(svg|png|jpe?g)$/.test(file));
    return NextResponse.json(logos);
  } catch (error) {
    console.error("Logo klasörü okunamadı:", error);
    return NextResponse.json([]);
  }
}