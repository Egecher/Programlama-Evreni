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

export async function POST(req: Request) {
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

    const formData = await req.json() as { image?: string };
    const { image } = formData;

    if (!image || typeof image !== 'string')
      return NextResponse.json({ error: 'Resim verisi boş veya geçersiz formatta' }, { status: 400 });

    if (image.length > 3000000)
      return NextResponse.json({ error: 'Resim boyutu çok büyük (Max: ~2MB)' }, { status: 413 });

    if (!image.startsWith('data:image/'))
      return NextResponse.json({ error: 'Yalnızca geçerli resim dosyaları yüklenebilir' }, { status: 415 });


    const user = await User.findById(userId);

    if (!user)
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });

    user.avatar = image;
    await user.save();

    return NextResponse.json({ message: 'Başarılı', avatarUrl: image });
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError)
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş oturum' }, { status: 401 });

    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen sunucu hatası';
    console.error("Yükleme Hatası:", errorMessage);
    return NextResponse.json({ error: 'Sunucu hatası oluştu' }, { status: 500 });
  }
}