import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface CustomJwtPayload extends JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
}

interface UpdateBody {
  email?: string;
  avatarUrl?: string;
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token)
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'gizli_anahtar'
    ) as CustomJwtPayload;

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId)
      return NextResponse.json({ error: 'Geçersiz token yapısı' }, { status: 401 });

    const body = (await req.json()) as UpdateBody;
    const { email, avatarUrl } = body;

    const updateData: Record<string, string> = {};

    if (email !== undefined) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Geçersiz e-posta formatı' }, { status: 400 });
      }
      updateData.email = email;
    }

    if (avatarUrl !== undefined) {
      if (typeof avatarUrl !== 'string')
        return NextResponse.json({ error: 'Geçersiz avatar formatı' }, { status: 400 });
      if (avatarUrl.length > 3000000)
        return NextResponse.json({ error: 'Resim boyutu çok büyük (Max: ~2MB)' }, { status: 413 });
      updateData.avatar = avatarUrl;
    }

    if (Object.keys(updateData).length === 0)
      return NextResponse.json({ error: 'Güncellenecek veri bulunamadı' }, { status: 400 });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser)
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });

    return NextResponse.json({
      message: 'Profil başarıyla güncellendi',
      user: updatedUser
    });

  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError)
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş oturum' }, { status: 401 });

    if (typeof error === 'object' && error !== null && 'code' in error && (error as Record<string, unknown>).code === 11000)
      return NextResponse.json({ error: 'Bu e-posta adresi zaten başka bir hesap tarafından kullanılıyor' }, { status: 409 });

    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen sunucu hatası';
    console.error("Profil güncelleme hatası:", errorMessage);
    return NextResponse.json({ error: 'Sunucu hatası oluştu' }, { status: 500 });
  }
}