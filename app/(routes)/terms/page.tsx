import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="text-center mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-6 text-3xl">
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Kullanım Şartları
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Son Güncelleme: 13 Mayıs 2026
          </p>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-handshake text-brand-primary"></i> 1. Hizmetin Kabulü
            </h2>
            <p>
              Programlama Evreni platformuna kayıt olarak veya platformu kullanarak bu Kullanım Şartları&apos;nı tamamıyla kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen platformu kullanmayı bırakın.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-user-check text-brand-primary"></i> 2. Kullanıcı Hesapları ve Sorumluluk
            </h2>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Her kullanıcı sadece bir (1) adet hesaba sahip olabilir. Birden fazla hesap (multi-account) açmak yasaktır.</li>
              <li>Hesabınızın güvenliğinden ve şifrenizin gizliliğinden tamamen siz sorumlusunuz.</li>
              <li>Davet sistemini suistimal etmek amacıyla sahte hesaplar açmak, hesabınızın kalıcı olarak kapatılmasına neden olur.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-code text-brand-primary"></i> 3. Platform Kuralları ve Hile (Anti-Cheat)
            </h2>
            <p>
              Adil bir liderlik tablosu (Leaderboard) sürdürmek bizim için kritiktir. Aşağıdaki eylemler kesinlikle yasaktır:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Kodlama ekranlarına platforma veya sunuculara zarar verecek zararlı kod parçacıkları (malware, sonsuz döngü saldırıları) göndermek.</li>
              <li>Soruların cevaplarını diğer kullanıcılarla paylaşmak veya otomatik çözen bot yazılımları kullanmak.</li>
              <li>Süre sistemini aşmaya yönelik tarayıcı tabanlı hileler (manipülasyonlar) yapmak.</li>
            </ul>
            <p className="mt-2 text-sm text-red-500 font-medium">
              * Bu kuralların ihlali durumunda puanlarınız sıfırlanabilir veya hesabınız tamamen silinebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-copyright text-brand-primary"></i> 4. Fikri Mülkiyet
            </h2>
            <p>
              Platformda yer alan algoritmik sorular, tasarımlar, logolar ve yazılım kodları Programlama Evreni&apos;ne aittir. Bu içeriklerin ticari amaçlarla başka platformlarda izinsiz kopyalanması, paylaşılması veya satılması yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-brand-primary"></i> 5. Hizmet Değişiklikleri
            </h2>
            <p>
              Platform, bildirimde bulunmaksızın soruların puan değerlerini, sürelerini veya rozet sistemlerini değiştirme hakkını saklı tutar. Aynı şekilde herhangi bir özellik askıya alınabilir veya sonlandırılabilir.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <Link href="/" className="inline-flex items-center text-brand-primary hover:text-green-700 font-bold transition-colors">
            <i className="fa-solid fa-arrow-left mr-2"></i> Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}