"use client";

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Bir hata oluştu.');
      }
    } catch {
      setStatus('error');
      setMessage('Bağlantı hatası. İnternetinizi kontrol edin.');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 4000);
  };

  return (
    <div>
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'loading'} required
          className="w-full px-4 py-3 sm:py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 transition-colors" 
          placeholder="E-posta adresin" />
        <button type="submit" disabled={status === 'loading'}
          className="bg-brand-primary hover:bg-green-700 text-white px-6 py-3 sm:py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap flex items-center justify-center min-w-25 disabled:opacity-70 disabled:cursor-not-allowed">
          {status === 'loading' ? (
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          ) : (
            'Abone Ol'
          )}
        </button>
      </form>

      {message && (
        <p className={`mt-2 text-xs font-medium ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}