"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Bir hata oluştu.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-6 text-3xl">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Bize Ulaşın
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Soru, öneri, hata bildirimi veya işbirliği talepleriniz için bizimle iletişime geçmekten çekinmeyin. Ekibimiz size en kısa sürede dönüş yapacaktır.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              İletişim Kanalları
            </h3>

            <div className="flex items-start p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md hover:border-brand-primary/30">
              <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xl">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="ml-5">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">E-Posta</h4>
                <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">Genel destek ve işbirlikleri için bize yazın.</p>
                <a href="mailto:destek@programlamaevreni.com" className="mt-2 inline-block font-medium text-brand-primary hover:underline">
                  destek@programlamaevreni.com
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-linear-to-br from-brand-primary/10 to-transparent rounded-2xl border border-brand-primary/20">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-brand-primary"></i> Sıkça Sorulan Sorular
              </h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Sorunuzun cevabı zaten SSS sayfamızda olabilir. Mesaj göndermeden önce göz atmak ister misiniz?
              </p>
              <Link href="/faq" className="mt-4 inline-flex items-center text-sm font-bold text-brand-primary hover:text-green-700 transition-colors">
                SSS Sayfasına Git <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-lg relative overflow-hidden">
            {status === 'success' && (
              <div className="absolute inset-0 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Mesajınız Alındı!</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Bizimle iletişime geçtiğiniz için teşekkür ederiz. Mesajınız ekibimize ulaştı, en kısa sürede e-posta adresiniz üzerinden size dönüş yapacağız.
                </p>
              </div>
            )}

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Mesaj Gönder
            </h3>

            {status === 'error' && errorMessage && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-lg"></i>
                <span className="font-medium text-sm">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adınız Soyadınız</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                    placeholder="Ahmet Yılmaz" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-Posta Adresiniz</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                    placeholder="ornek@mail.com" />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Konu</label>
                <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                  placeholder="Hangi konuda yardıma ihtiyacınız var?" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mesajınız</label>
                <textarea id="message" name="message" rows={5} required value={formData.message} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all resize-y"
                  placeholder="Mesajınızı detaylı bir şekilde buraya yazın..." />
              </div>

              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-brand-primary hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {status === 'loading' ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Gönderiliyor...</>
                ) : (
                  <><i className="fa-solid fa-paper-plane"></i> Mesajı Gönder</>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}