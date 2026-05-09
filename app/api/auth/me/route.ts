import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token)
      return NextResponse.json({ message: "Oturum bulunamadı." }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await User.findById(decoded.userId).select('-password');

    if (!user)
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Yetkisiz erişim veya geçersiz token." }, { status: 401 });
  }
}