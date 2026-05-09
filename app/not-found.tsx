import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="mb-6 relative group">
        <div className="absolute -inset-1.5 bg-linear-to-r from-brand-primary to-blue-600 rounded-full blur opacity-15 dark:opacity-10 group-hover:opacity-40 transition duration-700"></div>
        <div className="relative text-brand-primary flex items-center gap-4">
          <span className="text-9xl font-extrabold text-slate-900 dark:text-white leading-none">4</span>
          <i className="fa-solid fa-bug text-8xl animate-pulse"></i>
          <span className="text-9xl font-extrabold text-slate-900 dark:text-white leading-none">4</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
        Kodda Bir <span className="text-brand-primary">Böcek (Bug)</span> Bulduk!
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
        Görünüşe göre <code className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-sm text-blue-600 dark:text-blue-400">./programla-evreni</code> bellek adresinde aradığınız sayfaya ulaşamadık. Bu bir yazılım hatası olabilir veya sayfa silinmiş olabilir.
      </p>

      <Link href="/" className="bg-brand-primary hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg flex items-center gap-2">
        <i className="fa-solid fa-terminal text-sm"></i>
        <span>Güvenli Bölgeye Dön</span>
        <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  );
}