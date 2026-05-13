import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { status: 'error', message: 'Lütfen geçerli bir e-posta adresi girin.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json(
        { status: 'error', message: 'Bu e-posta adresi zaten bültenimize kayıtlı!' },
        { status: 400 }
      );
    }

    await Subscriber.create({ email });

    return NextResponse.json(
      { status: 'success', message: 'Bültene başarıyla abone oldunuz! 🎉' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Bülten abonelik hatası:', error);
    return NextResponse.json(
      { status: 'error', message: 'Sunucu hatası oluştu, lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}