import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Lütfen e-posta ve şifrenizi girin." }, { status: 400 });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ message: "Bu e-posta adresine ait bir hesap bulunamadı." }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Hatalı şifre girdiniz." }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      points: user.points,
      level: user.level,
      badges: user.badges
    };

    const response = NextResponse.json({
      message: "Giriş başarılı!",
      user: userData
    }, { status: 200 });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "Sunucu hatası", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Bilinmeyen bir hata oluştu." }, { status: 500 });
  }
}