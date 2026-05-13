import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { status: 'error', message: 'Lütfen mevcut ve yeni şifrenizi girin.' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { status: 'error', message: 'Yeni şifreniz en az 8 karakter olmalı, en az 1 harf ve 1 rakam içermelidir.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Bu işlem için giriş yapmalısınız.' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar') as DecodedToken;
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Geçersiz oturum.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { status: 'error', message: 'Mevcut şifrenizi yanlış girdiniz.' },
        { status: 400 }
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { status: 'error', message: 'Yeni şifreniz, eski şifrenizle aynı olamaz.' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json(
      { status: 'success', message: 'Şifreniz başarıyla güncellendi.' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Şifre güncelleme hatası:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { status: 'error', message: 'Oturum süreniz dolmuş, lütfen tekrar giriş yapın.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: 'Sunucu tarafında bir hata oluştu.' },
      { status: 500 }
    );
  }
}