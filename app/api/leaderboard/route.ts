import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

interface ICompletedChallenge {
  status: string;
}

interface IUser {
  _id: Types.ObjectId;
  username: string;
  points: number;
  level: number;
  avatar?: string;
  completedChallenges?: ICompletedChallenge[];
}

export async function GET() {
  try {
    await connectToDatabase();

    const topUsers = await User.find({}, 'username points level avatar completedChallenges')
      .sort({ points: -1 })
      .limit(50)
      .lean<IUser[]>();

    const leaderboard = topUsers.map((user, index) => ({
      id: user._id.toString(),
      rank: index + 1,
      name: user.username,
      avatarUrl: user.avatar || null,
      points: user.points,
      level: user.level,
      solved: user.completedChallenges?.filter((c) => c.status === 'Başarılı').length || 0,
      trend: 'same' 
    }));

    return NextResponse.json(leaderboard);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen sunucu hatası';
    console.error("Sıralama yükleme hatası:", errorMessage);
    return NextResponse.json({ error: "Sıralama yüklenemedi." }, { status: 500 });
  }
}