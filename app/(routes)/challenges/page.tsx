/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import User from '@/models/User';
import ChallengeCard from '@/components/layout/ChallengeCard';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

interface ChallengeItem {
  _id: { toString: () => string };
  title: string;
  description: string;
  difficulty: string;
  points: number;
  duration: number;
  category: string;
  logo: string;
}

interface DecodedToken extends JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
}

type ChallengeStatus = 'Devam Ediyor' | 'Başarılı' | 'Süre Doldu' | 'Hatalı';

interface CompletedChallengeRecord {
  challenge: mongoose.Types.ObjectId | string;
  status: ChallengeStatus;
}

export default async function ChallengesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || 'Tümü';

  await connectToDatabase();

  const distinctCategories = await Challenge.distinct('category');
  const query = activeCategory === 'Tümü' ? {} : { category: activeCategory };
  const challenges = await Challenge.find(query).sort({ createdAt: -1 }).lean() as ChallengeItem[];

  const userChallengeStatuses: Record<string, ChallengeStatus> = {};

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar') as DecodedToken;
      const userId = decoded.id || decoded.userId || decoded._id;

      const user = await User.findById(userId).select('completedChallenges').lean();

      if (user && user.completedChallenges) {
        user.completedChallenges.forEach((c: CompletedChallengeRecord) => {
          userChallengeStatuses[c.challenge.toString()] = c.status;
        });
      }
    } catch (error) {}
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">

        <aside className="w-full md:w-1/4">
          <div className="sticky top-24">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Kategoriler</h2>
            <nav className="flex flex-col gap-1">
              <Link href="/challenges" className={`block text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === 'Tümü'
                  ? "bg-green-50 text-green-700 border-l-4 border-green-600 dark:bg-green-900/20 dark:text-green-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" }`}>
                Tümü
              </Link>

              {distinctCategories.map((cat: string) => (
                <Link key={cat} href={`/challenges?category=${encodeURIComponent(cat)}`}
                  className={`block text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat 
                    ? "bg-green-50 text-green-700 border-l-4 border-green-600 dark:bg-green-900/20 dark:text-green-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}>
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <section className="w-full md:w-3/4">
          <nav className="flex text-sm text-slate-500 mb-6 gap-2">
            <Link href="/challenges" className="hover:text-brand-primary cursor-pointer transition-colors">Challenges</Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{activeCategory}</span>
          </nav>

          <div className="max-w-3xl flex flex-col gap-4">
            {challenges.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                Bu kategoride henüz soru bulunmuyor.
              </div>
            ) : (
              challenges.map((challenge: ChallengeItem) => {
                const challengeIdStr = challenge._id.toString();
                const currentStatus = userChallengeStatuses[challengeIdStr];

                return (
                  <ChallengeCard key={challengeIdStr}
                    id={challengeIdStr}
                    title={challenge.title}
                    description={challenge.description}
                    difficulty={challenge.difficulty}
                    points={challenge.points}
                    duration={`${challenge.duration}`}
                    logo={challenge.logo}
                    userStatus={currentStatus} />
                );
              })
            )}
          </div>

        </section>
      </div>
    </div>
  );
}