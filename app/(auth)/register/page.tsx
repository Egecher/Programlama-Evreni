import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import Challenge from '@/models/Challenge';

interface ChallengeItem {
  _id: { toString: () => string };
  title: string;
  description: string;
  difficulty: string;
  points: number;
  duration: number;
  logo?: string;
}

export default async function Home() {
  await connectToDatabase();

  let featuredChallenges = await Challenge.find({ isFeatured: true })
    .limit(3)
    .lean() as ChallengeItem[];

  if (featuredChallenges.length < 3) {
    const additional = await Challenge.find({ isFeatured: false, _id: { $nin: featuredChallenges.map((c: ChallengeItem) => c._id) }})
      .sort({ createdAt: -1 })
      .limit(3 - featuredChallenges.length)
      .lean() as ChallengeItem[];
    featuredChallenges = [...featuredChallenges, ...additional];
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center pt-12 md:pt-20 pb-10 border-b border-slate-200 dark:border-slate-800 mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900 dark:text-white">
          Programlama <span className="text-brand-primary">Evreni</span>
        </h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Programlama ile ilgili meydan okumalara katılarak liderlik tablosunda yerinizi alın. 
            Her sorunun kendine özel <span className="text-brand-primary font-bold">puanı</span> ve 
            <span className="text-slate-500 font-bold"> süresi</span> vardır.
          </p>
        </div>
      </header>

      <section className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden mb-16">
        <div className="p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold mb-6">İstatistikler</h2>
          <hr className="border-slate-700 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl text-slate-400 mb-2">Toplam Soru:</h3>
              <span className="text-4xl font-bold text-brand-primary">150+</span>
            </div>
            <div className="border-y md:border-y-0 md:border-x border-slate-700 py-6 md:py-0">
              <h3 className="text-xl text-slate-400 mb-2">Aktif Kullanıcı:</h3>
              <span className="text-4xl font-bold text-brand-primary">2.000+</span>
            </div>
            <div>
              <h3 className="text-xl text-slate-400 mb-2">Tamamlanan Challenge:</h3>
              <span className="text-4xl font-bold text-brand-primary">15.000+</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">Süreç Nasıl İşler?</h2>
          <p className="text-slate-500">3 basit adımda programlama evrenine giriş yap.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4 transition-transform hover-icon">
              <i className="fa-solid fa-user-plus text-3xl"></i>
            </div>
            <h4 className="text-xl font-bold mb-2 dark:text-white">1. Hesabını Oluştur</h4>
            <p className="text-slate-500 text-sm">Hızlıca kayıt ol ve sana özel profilini oluşturarak puanlarını biriktirmeye başla.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mb-4 transition-transform hover-icon">
              <i className="fa-solid fa-code text-3xl"></i>
            </div>
            <h4 className="text-xl font-bold mb-2 dark:text-white">2. Meydan Oku</h4>
            <p className="text-slate-500 text-sm">Farklı dillerdeki sorulardan sana uygun olanı seç ve belirlenen sürede kodu tamamla.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 text-brand-primary rounded-full flex items-center justify-center mb-4 transition-transform hover-icon">
              <i className="fa-solid fa-trophy text-3xl"></i>
            </div>
            <h4 className="text-xl font-bold mb-2 dark:text-white">3. Liderliğe Yüksel</h4>
            <p className="text-slate-500 text-sm">Çözdüğün her sorudan puan kazan ve hem genel hem de dil bazlı sıralamada yerini al.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden mb-16">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Zirveye Oyna!</h2>
            <p className="text-lg text-slate-300 opacity-90">
              Kaydını tamamladıysan daha ne duruyorsun? Puanları topla, süreyi yönet ve liderlik tablosunda adını duyur.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end mt-4 md:mt-0">
            <Link href="/challenges" className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-full font-bold text-lg transition-colors whitespace-nowrap shadow-lg">
              Meydan Oku
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Popüler</h3>
          <Link href="/challenges" className="text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
            Tümünü Gör <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredChallenges.map((challenge: ChallengeItem) => {
            const diffClass = 
              challenge.difficulty === 'Kolay' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400' :
              challenge.difficulty === 'Orta' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400';

            return (
              <div key={challenge._id.toString()} className="bg-white dark:bg-slate-900 border-t-4 border-t-brand-primary rounded-xl p-6 flex flex-col h-full border-x border-b border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <span className={`${diffClass} text-xs font-bold px-3 py-1 rounded-md`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <i className="fa-solid fa-clock"></i> {challenge.duration} Dakika
                  </span>
                </div>
                <h5 className="text-lg font-bold mb-2 dark:text-white line-clamp-1">{challenge.title}</h5>
                <p className="text-slate-500 text-sm mb-6 grow line-clamp-3">{challenge.description}</p>
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <div>
                    <span className="block text-slate-400 text-xs mb-1">Ödül</span>
                    <span className="font-bold text-brand-primary">+{challenge.points} Puan</span>
                  </div>
                  <Link href={`/challenges/${challenge._id.toString()}`} className="bg-brand-primary hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
                    Çöz
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}