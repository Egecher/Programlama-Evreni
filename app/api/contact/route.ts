import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { status: 'error', message: 'Lütfen tüm alanları doldurun.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newContactMessage = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContactMessage.save();

    return NextResponse.json(
      { status: 'success', message: 'Mesajınız başarıyla alındı. Ekibimiz en kısa sürede dönüş yapacaktır.' },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('İletişim formu kayıt hatası:', error);
    return NextResponse.json(
      { status: 'error', message: 'Sunucu tarafında bir hata oluştu, lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}