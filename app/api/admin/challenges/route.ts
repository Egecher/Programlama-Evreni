import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Challenge from '@/models/Challenge';

export async function GET() {
  try {
    await connectToDatabase();
    const challenges = await Challenge.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(challenges);
  } catch (error) {
    console.error("GET /api/admin/challenges Hatası:", error);
    return NextResponse.json({ error: 'Sorular getirilemedi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newChallenge = await Challenge.create(data);
    return NextResponse.json({ message: 'Başarıyla eklendi', challenge: newChallenge });
  } catch (error) {
    console.error("POST /api/admin/challenges Hatası:", error);
    return NextResponse.json({ error: 'Eklenemedi' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parametresi eksik!' }, { status: 400 });
    }
    const data = await req.json();
    await Challenge.findByIdAndUpdate(id, data);
    return NextResponse.json({ message: 'Başarıyla güncellendi' });
  } catch (error) {
    console.error("PUT /api/admin/challenges Hatası:", error);
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID parametresi eksik!' }, { status: 400 });
    }
    await Challenge.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Başarıyla silindi' });
  } catch (error) {
    console.error("DELETE /api/admin/challenges Hatası:", error);
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
}