import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 mt-12 border-t border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <h5 className="text-xl font-bold mb-4 text-brand-primary flex items-center">
              <i className="fa-solid fa-code mr-2"></i> Programlama Evreni
            </h5>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed lg:pr-4">
              Kodlama dünyasına dair meydan okumalar, güncel içerikler ve liderlik yarışı.
              Kendini geliştir, puanları topla ve en iyilerin arasına gir.
            </p>

            <div className="flex gap-5 mt-6 text-2xl">
              <a href="https://www.youtube.com/@ProgramlamaEvreni" className="text-[#ff0000] hover:scale-110 transition-transform" target="_blank" title="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://t.me/egecdev" className="text-[#0088cc] hover:scale-110 transition-transform" target="_blank" title="Telegram">
                <i className="fa-brands fa-telegram"></i>
              </a>
              <a href="https://github.com/Programlama-Evreni" className="text-slate-800 dark:text-slate-200 hover:scale-110 transition-transform" target="_blank" title="GitHub">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://www.instagram.com/egec.dev" className="text-[#E1306C] hover:scale-110 transition-transform" target="_blank" title="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h6 className="font-bold mb-4 dark:text-white">Navigasyon</h6>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/" className="hover:text-brand-primary transition-colors block">Ana Sayfa</Link></li>
              <li><Link href="/challenges" className="hover:text-brand-primary transition-colors block">Meydan Okumalar</Link></li>
              <li><Link href="/leaderboard" className="hover:text-brand-primary transition-colors block">Liderlik Tablosu</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h6 className="font-bold mb-4 dark:text-white">Topluluk</h6>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="https://t.me/egecdev" target="_blank" className="hover:text-brand-primary transition-colors block">Telegram Kanalı</a></li>
              <li><Link href="/faq" className="hover:text-brand-primary transition-colors block">Sıkça Sorulanlar</Link></li>
              <li><Link href="/contact" className="hover:text-brand-primary transition-colors block">Bize Ulaşın</Link></li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <h6 className="font-bold mb-4 dark:text-white">Yeni Challenge&apos;lardan Haberdar Ol</h6>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">E-posta listemize katıl, yeni sorular eklendiğinde ilk sen duy.</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input type="email" className="w-full px-4 py-3 sm:py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                placeholder="E-posta adresin" />
              <button className="bg-brand-primary hover:bg-green-700 text-white px-6 py-3 sm:py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
                Abone Ol
              </button>
            </form>
          </div>
        </div>

        <hr className="my-8 border-slate-200 dark:border-slate-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
          <p className="text-center md:text-left">&copy; 2026 Programlama Evreni. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-primary transition-colors">Gizlilik</Link>
            <Link href="/terms" className="hover:text-brand-primary transition-colors">Şartlar</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}