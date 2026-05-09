import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { username, email, password, referrerId } = body;

    if (!username || !email || !password)
      return NextResponse.json({ message: "Lütfen tüm alanları doldurun." }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ message: "Şifre en az 6 karakter olmalıdır." }, { status: 400 });

    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser)
      return NextResponse.json({ message: "Bu e-posta veya kullanıcı adı zaten kullanımda." }, { status: 409 });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    if (referrerId) {
      const referrer = await User.findById(referrerId);

      if (referrer) {
        referrer.invitedUsers.push(newUser._id);
        referrer.referralCount += 1;

        if (referrer.referralCount >= 5 && !referrer.isReferralRewardClaimed) {
          referrer.points += 100;
          referrer.isReferralRewardClaimed = true;
          referrer.badges.push({
            name: 'Davet Ustası',
            icon: 'fa-users',
            earnedAt: new Date()
          });
        }
        await referrer.save();
      }
    }

    return NextResponse.json({
      message: "Kayıt işlemi başarıyla tamamlandı!",
      userId: newUser._id
    }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "Sunucu hatası", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Bilinmeyen bir hata oluştu." }, { status: 500 });
  }
}