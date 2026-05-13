import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="text-center mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-6 text-3xl">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Gizlilik Politikası
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Son Güncelleme: 13 Mayıs 2026
          </p>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-database text-brand-primary"></i> 1. Topladığımız Veriler
            </h2>
            <p>
              Programlama Evreni olarak size daha iyi bir eğitim deneyimi sunmak için şu bilgileri topluyoruz:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Kayıt Bilgileri:</strong> Kullanıcı adı, e-posta adresi ve şifrelenmiş (kriptolanmış) parolanız.</li>
              <li><strong>Platform Etkileşimleri:</strong> Çözdüğünüz quizler, yazdığınız kodlar, sınavlarda harcadığınız süreler ve kazandığınız puanlar.</li>
              <li><strong>Teknik Veriler:</strong> IP adresiniz, tarayıcı türünüz ve sisteme giriş yaptığınız cihaz bilgileri (güvenlik amacıyla).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-gears text-brand-primary"></i> 2. Verilerin Kullanımı
            </h2>
            <p>
              Toplanan veriler platformu işletmek ve geliştirmek amacıyla kullanılır:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Liderlik tablosundaki (Leaderboard) sıralamanızı belirlemek.</li>
              <li>Size özel zorluk seviyelerinde yeni sorular önermek.</li>
              <li>Güvenliği sağlamak ve hile/spam girişimlerini engellemek.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-cookie-bite text-brand-primary"></i> 3. Çerezler (Cookies)
            </h2>
            <p>
              Sistemimizde oturumunuzun açık kalması ve güvenliğinizin sağlanması için JWT (JSON Web Token) altyapısı ve zorunlu çerezler kullanılmaktadır. Sitemizi kullanarak bu zorunlu çerezlerin kullanımını kabul etmiş sayılırsınız. Pazarlama veya reklam amaçlı 3. parti çerezler kullanılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lock text-brand-primary"></i> 4. Veri Güvenliği
            </h2>
            <p>
              Şifreleriniz veritabanımızda açık metin olarak değil, endüstri standardı &quot;Bcrypt&quot; algoritmalarıyla geri döndürülemez şekilde şifrelenerek saklanır. Hiçbir sistem yöneticisi şifrenizi göremez. Verilerinizi asla 3. şahıslara veya kurumlara satmıyoruz.
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