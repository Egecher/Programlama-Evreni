import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Challenge from '@/models/Challenge';

export const dynamic = 'force-dynamic';

interface CustomJwtPayload extends JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
}

export async function GET() {
  try {
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

    await connectToDatabase();

    const user = await User.findById(userId)
      .populate({
        path: 'completedChallenges.challenge',
        model: Challenge,
        select: 'title logo difficulty points'
      })
      .select('-password')
      .lean();

    if (!user)
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });

    return NextResponse.json(user);

  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError)
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş oturum' }, { status: 401 });

    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen sunucu hatası';
    console.error("Profil yükleme hatası:", errorMessage);
    return NextResponse.json({ error: 'Sunucu hatası oluştu' }, { status: 500 });
  }
}