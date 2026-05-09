import { connectToDatabase } from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import User from '@/models/User';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ChallengeWorkspace from '@/components/challenges/ChallengeWorkspace';

interface DecodedToken extends JwtPayload { id: string; }

interface CompletedChallengeRecord {
  challenge: mongoose.Types.ObjectId | string;
  status: string;
  startedAt: Date | string;
  submittedAnswer?: string;
  timeSpent?: number;
}

export default async function SingleChallengePage({ 
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ view?: string }>
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const view = resolvedSearchParams.view;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect(`/login?message=${encodeURIComponent('Bu soruyu görmek için giriş yapmalısın.')}`);

  await connectToDatabase();
  const challenge = await Challenge.findById(id).lean();

  if (!challenge) {
    notFound();
  }

  let remainingSeconds = challenge.duration * 60;
  let challengeStatus = 'Not Started';
  let submittedAnswer = "";
  let timeSpentSeconds = 0;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar') as DecodedToken;
    const userId = decoded.id || decoded.userId || decoded._id;
    const user = await User.findById(userId).lean();

    if (user && user.completedChallenges) {
      const existingRecord = user.completedChallenges.find(
        (c: CompletedChallengeRecord) => c.challenge.toString() === id
      );

      if (existingRecord) {
        challengeStatus = existingRecord.status;
        submittedAnswer = existingRecord.submittedAnswer || "";
        timeSpentSeconds = existingRecord.timeSpent || 0;

        if (challengeStatus === 'Devam Ediyor') {
            const now = new Date();
            const startedAt = new Date(existingRecord.startedAt);
            const elapsedSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
            remainingSeconds = Math.max(0, (challenge.duration * 60) - elapsedSeconds);
        } else {
            remainingSeconds = 0;
        }
      }
    }
  } catch {
    redirect(`/login?message=${encodeURIComponent('Oturumun süresi dolmuş, tekrar giriş yap.')}`);
  }

  const isAlreadyFinished = ['Başarılı', 'Hatalı', 'Süre Doldu'].includes(challengeStatus);
  const isReadOnly = view === 'true' || isAlreadyFinished;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link href="/challenges" className="text-slate-500 hover:text-brand-primary mb-8 inline-flex items-center gap-2 transition-colors font-medium">
        <i className="fa-solid fa-arrow-left"></i> Tüm Sorulara Dön
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-brand-primary/10 text-brand-primary font-bold px-4 py-1.5 rounded-full text-sm">
            {challenge.category}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
            <i className="fa-solid fa-star text-brand-primary"></i> {challenge.points} Puan
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
            <i className="fa-solid fa-clock text-blue-500"></i> {challenge.duration} dk
          </span>
          <span className={`font-bold px-4 py-1.5 rounded-full text-sm ${
            challenge.difficulty === 'Kolay' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
            challenge.difficulty === 'Orta' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            Zorluk: {challenge.difficulty}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
          {challenge.title}
        </h1>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-8">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {challenge.description}
          </p>
        </div>
      </div>

      <ChallengeWorkspace challengeId={id} durationSeconds={remainingSeconds} type={challenge.type || 'code'} options={challenge.options || []}
        initialStatus={challengeStatus}
        challengePoints={challenge.points}
        isReadOnly={isReadOnly}
        submittedAnswer={submittedAnswer}
        correctAnswer={challenge.correctAnswer || ""}
        timeSpentStr={isAlreadyFinished ? formatTime(timeSpentSeconds) : ""}
      />
    </div>
  );
}