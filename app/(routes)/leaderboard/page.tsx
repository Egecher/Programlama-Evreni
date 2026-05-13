/* eslint-disable @next/next/no-img-element */
export const revalidate = 60;

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string | null;
  points: number;
  level: string;
  solved: number;
  trend: 'up' | 'down' | 'same';
}

async function getLeaderboardData(): Promise<LeaderboardUser[]> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}` : 'http://localhost:3000');

  try {
    const res = await fetch(`${baseUrl}/api/leaderboard`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) return [];

    return (await res.json()) as LeaderboardUser[];
  } catch {
    return [];
  }
}

export default async function LeaderboardPage() {
  const leaderboardData = await getLeaderboardData();
  const top3 = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  if (leaderboardData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Henüz kimse sıralamaya girmemiş!</h2>
        <p className="text-slate-500 mt-2">İlk çözen sen ol, zirveye otur.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Liderlik <span className="text-brand-primary">Tablosu</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          En çok meydan okumayı tamamlayan ve en yüksek puanı toplayan geliştiriciler.
          Zirvedeki yerini almak için kodlamaya başla!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto items-end">
        {top3[1] && (
          <div className="order-2 md:order-1 bg-white dark:bg-slate-900 rounded-2xl p-6 border-t-4 border-slate-300 dark:border-slate-600 shadow-lg text-center transform md:-translate-y-4">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-300 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-slate-900 z-10">2</div>
              <img 
                src={top3[1].avatarUrl || `https://ui-avatars.com/api/?name=${top3[1].name}&background=cbd5e1&color=334155`} 
                alt={top3[1].name} 
                className="rounded-full w-full h-full object-cover border-4 border-slate-100 dark:border-slate-800 bg-slate-100" 
              />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">{top3[1].name}</h3>
            <p className="text-brand-primary font-bold text-xl my-2">{top3[1].points.toLocaleString()} <span className="text-xs text-slate-500 font-normal">Puan</span></p>
            <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-3 py-1 rounded-full">{top3[1].level}</span>
          </div>
        )}

        {top3[0] && (
          <div className="order-1 md:order-2 bg-linear-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 rounded-2xl p-8 border-t-4 border-amber-400 shadow-xl text-center relative z-10 transform md:-translate-y-8">
            <i className="fa-solid fa-crown text-4xl text-amber-400 absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-md"></i>
            <div className="relative w-28 h-28 mx-auto mb-4 mt-2">
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-900 z-10">1</div>
              <img 
                src={top3[0].avatarUrl || `https://ui-avatars.com/api/?name=${top3[0].name}&background=fbbf24&color=78350f`} 
                alt={top3[0].name} 
                className="rounded-full w-full h-full object-cover border-4 border-amber-100 dark:border-amber-900/30 shadow-inner bg-amber-50" 
              />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white truncate">{top3[0].name}</h3>
            <p className="text-amber-500 font-black text-3xl my-2">{top3[0].points.toLocaleString()} <span className="text-sm text-slate-500 font-normal">Puan</span></p>
            <span className="inline-block bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs px-4 py-1 rounded-full font-bold">{top3[0].level}</span>
          </div>
        )}

        {top3[2] && (
          <div className="order-3 md:order-3 bg-white dark:bg-slate-900 rounded-2xl p-6 border-t-4 border-orange-400 dark:border-orange-700 shadow-lg text-center transform md:-translate-y-4">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-slate-900 z-10">3</div>
              <img 
                src={top3[2].avatarUrl || `https://ui-avatars.com/api/?name=${top3[2].name}&background=fb923c&color=fff`} 
                alt={top3[2].name} 
                className="rounded-full w-full h-full object-cover border-4 border-orange-50 dark:border-slate-800 bg-orange-50" 
              />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">{top3[2].name}</h3>
            <p className="text-brand-primary font-bold text-xl my-2">{top3[2].points.toLocaleString()} <span className="text-xs text-slate-500 font-normal">Puan</span></p>
            <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-3 py-1 rounded-full">{top3[2].level}</span>
          </div>
        )}
      </div>

      {others.length > 0 && (
        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 font-semibold text-center w-16">Sıra</th>
                  <th className="p-4 font-semibold">Geliştirici</th>
                  <th className="p-4 font-semibold text-center hidden sm:table-cell">Çözülen</th>
                  <th className="p-4 font-semibold text-right">Puan</th>
                </tr>
              </thead>
              <tbody>
                {others.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 text-center font-bold text-slate-500 dark:text-slate-400">
                      #{user.rank}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=198754&color=fff`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {user.level}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center hidden sm:table-cell text-slate-600 dark:text-slate-400">
                      {user.solved}
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-end gap-2">
                        <span>{user.points.toLocaleString()}</span>
                        {user.trend === 'up' && <i className="fa-solid fa-caret-up text-brand-primary text-sm"></i>}
                        {user.trend === 'down' && <i className="fa-solid fa-caret-down text-red-500 text-sm"></i>}
                        {user.trend === 'same' && <i className="fa-solid fa-minus text-slate-400 text-xs"></i>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}