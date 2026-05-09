import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Challenge from '@/models/Challenge';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { userId, challengeId, status, startedAt, completedAt, timeSpent } = body;

    const user = await User.findById(userId);
    const challenge = await Challenge.findById(challengeId);

    if (!user || !challenge) {
      return NextResponse.json({ message: "Kullanıcı veya Soru bulunamadı." }, { status: 404 });
    }

    let earnedPoints = 0;
    const basePoints = challenge.points;

    if (status === 'Doğru') {
      earnedPoints = basePoints; // Tam puan
    } else if (status === 'Yanlış') {
      earnedPoints = -(basePoints * 0.5); // %50 Ceza
    } else if (status === 'Boş' || status === 'Süre Doldu') {
      earnedPoints = -Math.round(basePoints * 0.3); // %30 Ceza
    }

    // Haftalık meydan okuma ve rozet
    if (challenge.isWeekly && status === 'Doğru') {
      const hasWeeklyBadge = user.badges.some((b: { name: string }) => b.name === 'Haftalık Kahraman');

      if (!hasWeeklyBadge) {
        user.badges.push({
          name: 'Haftalık Kahraman',
          icon: 'fa-calendar-check',
          earnedAt: new Date()
        });
      }
    }

    // Davet sistemi kontrolü
    if (user.referralCount >= 5 && !user.isReferralRewardClaimed) {
      user.points += 100;
      user.isReferralRewardClaimed = true;
      user.badges.push({
        name: 'Davet Ustası',
        icon: 'fa-users',
        earnedAt: new Date()
      });
    }

    user.points += earnedPoints;

    user.completedChallenges.push({
      challenge: challenge._id,
      startedAt: new Date(startedAt),
      completedAt: new Date(completedAt),
      timeSpent: timeSpent,
      status: status,
      earnedPoints: earnedPoints
    });

    await user.save();

    return NextResponse.json({
      message: "İşlem başarılı!",
      earnedPoints,
      currentPoints: user.points,
      badges: user.badges
    }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "Sunucu hatası", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Bilinmeyen bir hata oluştu." }, { status: 500 });
  }
}