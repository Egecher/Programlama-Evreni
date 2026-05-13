import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Challenge, { IChallenge } from '@/models/Challenge';
import User, { IUser } from '@/models/User';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

interface DecodedToken extends JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
}

interface IChallengeRecord {
  challenge: mongoose.Types.ObjectId | string;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number;
  status: 'Devam Ediyor' | 'Başarılı' | 'Süre Doldu' | 'Hatalı';
  earnedPoints: number;
  submittedAnswer?: string;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, answer }: { action: 'start' | 'submit'; answer?: string } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: "Giriş yapmalısın!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar') as DecodedToken;
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return NextResponse.json({ status: 'error', message: "Geçersiz token." }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(userId) as (IUser & { completedChallenges: mongoose.Types.DocumentArray<IChallengeRecord & mongoose.Document> }) | null;
    const challenge = await Challenge.findById(id) as IChallenge | null;

    if (!user || !challenge) {
      return NextResponse.json({ status: 'error', message: "Kullanıcı veya Soru bulunamadı!" }, { status: 400 });
    }

    if (action === 'start') {
      const updateResult = await User.updateOne(
        { _id: userId, "completedChallenges.challenge": { $ne: id } },
        {
          $push: {
            completedChallenges: {
              challenge: id,
              startedAt: new Date(),
              status: 'Devam Ediyor',
              timeSpent: 0,
              earnedPoints: 0
            }
          }
        }
      );

      if (updateResult.modifiedCount === 0) {
        return NextResponse.json({ message: "Sınav zaten devam ediyor." });
      }

      return NextResponse.json({ message: "Süre başladı!" });
    }

    if (action === 'submit') {
      const existingRecord = user.completedChallenges.find(
        (c) => c.challenge.toString() === id
      );

      if (!existingRecord) {
        return NextResponse.json({ status: 'error', message: "Önce sınava başlamalısın." }, { status: 400 });
      }

      if (existingRecord.status !== 'Devam Ediyor') {
        return NextResponse.json({ status: 'error', message: "Bu soruyu zaten tamamladın!" }, { status: 400 });
      }

      const now = new Date();
      const startedAt = new Date(existingRecord.startedAt);
      const timeSpentSec = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
      const maxAllowedSec = challenge.duration * 60 + 5;

      existingRecord.completedAt = now;
      existingRecord.timeSpent = timeSpentSec;
      existingRecord.submittedAnswer = answer;

      let isCorrect = false;
      if (challenge.type === 'quiz') {
        isCorrect = answer === challenge.correctAnswer;
      } else if (challenge.type === 'code') {
        isCorrect = true;
      }

      if (timeSpentSec > maxAllowedSec) {
        existingRecord.status = 'Süre Doldu';
        existingRecord.earnedPoints = 0;
        await user.save();

        const timeoutMessage = isCorrect
          ? 'Cevabın DOĞRU! 🎉 Ancak süren dolduğu için maalesef puan kazanamadın.'
          : 'Süren doldu ve cevabın YANLIŞ. 😔 Puan kazanamadın.';

        return NextResponse.json({ status: 'error', message: timeoutMessage });
      }

      if (isCorrect) {
        existingRecord.status = 'Başarılı';
        existingRecord.earnedPoints = challenge.points;
        user.points += challenge.points;

        await user.save();

        return NextResponse.json({
          status: 'success',
          message: `Tebrikler! +${challenge.points} Puan kazandın.`
        });
      } else {
        existingRecord.status = 'Hatalı';
        existingRecord.earnedPoints = 0;

        await user.save();

        return NextResponse.json({
          status: 'error',
          message: 'Yanlış cevap verdin, maalesef puan alamadın.'
        });
      }
    }

    return NextResponse.json({ status: 'error', message: "Geçersiz işlem tipi." }, { status: 400 });
  } catch (error: unknown) {
    console.error("SUNUCU HATASI:", error);
    return NextResponse.json({
      status: 'error',
      message: "Sunucu hatası oluştu."
    }, { status: 500 });
  }
}