"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCodeFromUrl = searchParams.get('ref') || '';
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referrerId: refCodeFromUrl
  });

  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Kayıt olurken bir hata oluştu.');
      }

      setStatus({ loading: false, error: '', success: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...' });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus({ loading: false, error: error.message, success: '' });
      } else {
        setStatus({ loading: false, error: 'Bilinmeyen bir hata oluştu.', success: '' });
      }
    }
  };

  return (
    <>
      {status.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 border border-red-200 dark:border-red-800">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>{status.error}</span>
        </div>
      )}
      {status.success && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm flex items-center gap-2 border border-green-200 dark:border-green-800">
          <i className="fa-solid fa-circle-check"></i>
          <span>{status.success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Kullanıcı Adı</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-user"></i>
            </div>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              placeholder="Örn: EgecDev"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">E-posta Adresi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <input type="email" name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              placeholder="mail@adresin.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Şifre</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-lock"></i>
            </div>
            <input type="password" name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              placeholder="En az 6 karakter"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Referans Kodu <span className="text-slate-400 font-normal">(İsteğe Bağlı)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <input type="text" name="referrerId" value={formData.referrerId} onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              placeholder="Arkadaşının davet kodu"
            />
          </div>
          {refCodeFromUrl && (
            <p className="text-xs text-brand-primary mt-1 flex items-center gap-1">
              <i className="fa-solid fa-check"></i> Referans kodu bağlantıdan otomatik alındı.
            </p>
          )}
        </div>

        <button type="submit" disabled={status.loading || !!status.success}
          className="w-full bg-brand-primary hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
          {status.loading ? (
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          ) : (
            <>
              <span>Kayıt Ol</span>
              <i className="fa-solid fa-arrow-right"></i>
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-4 text-2xl">
            <i className="fa-solid fa-rocket"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Aramıza Katıl</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kodlama evreninde yerini al ve meydan okumalara başla.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-slate-500 py-4"><i className="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>}>
          <RegisterForm />
        </Suspense>

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Zaten bir hesabın var mı?{' '}
          <Link href="/login" className="font-bold text-brand-primary hover:underline">
            Giriş Yap
          </Link>
        </div>

      </div>
    </div>
  );
}