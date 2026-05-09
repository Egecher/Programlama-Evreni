"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ChallengeProps {
  id?: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  duration: string;
  logo: string;
  isCompleted?: boolean;
}

export default function ChallengeCard({ id, title, description, difficulty, points, duration, logo, isCompleted = false }: ChallengeProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleAction = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (id) {
      router.push(`/challenges/${id}${isCompleted ? '?view=true' : ''}`);
    }
  };

  return (
    <div className="group mb-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-all hover:shadow-lg">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-full sm:w-1/4 flex justify-center items-center p-6">
          <div className="relative w-24 h-24 transition-transform">
            <Image src={logo} alt={`${title} logo`} fill className="object-cover" priority />
          </div>
        </div>

        <div className="w-full sm:w-3/4 p-5">
          <div className="flex justify-between items-center mb-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              difficulty === 'Kolay' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {difficulty}
            </span>
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <span className="opacity-70">🕒</span> {duration} Dakika
            </span>
          </div>

          <h5 className="text-lg font-bold mb-1 text-slate-800 dark:text-slate-100">{title}</h5>
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
            {description}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">🏆</span>
              <span className="font-bold text-green-600">+{points} Puan</span>
            </div>

            <button onClick={handleAction} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
              {isCompleted ? 'Çözümü Görüntüle' : 'Meydan Oku'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}