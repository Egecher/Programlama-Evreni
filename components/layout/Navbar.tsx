/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return `transition-colors duration-300 font-medium ${
      isActive
        ? "text-brand-primary"
        : "text-slate-600 dark:text-slate-300 hover:text-brand-primary"
    }`;
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
            <i className="fa-solid fa-code text-brand-primary"></i>
            <span>Programlama <span className="hidden sm:inline text-brand-primary">Evreni</span></span>
          </Link>

          <button onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 focus:outline-none">
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-6 text-sm">
              <li><Link href="/" className={getLinkStyle('/')}><i className="fa-solid fa-house-chimney me-1 small"></i> Ana Sayfa</Link></li>
              <li><Link href="/challenges" className={getLinkStyle('/challenges')}>Challenges</Link></li>
              <li><Link href="/leaderboard" className={getLinkStyle('/leaderboard')}>Leaderboard</Link></li>
            </ul>

            <div className="flex items-center gap-4 border-l pl-6 border-slate-200 dark:border-slate-700">
              <button onClick={toggleTheme} className="theme-toggle-icon flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Temayı Değiştir">
                {mounted ? (
                  theme === 'dark' ? (
                    <i className="fa-solid fa-moon text-slate-400"></i>
                  ) : (
                    <i className="fa-solid fa-sun text-amber-500"></i>
                  )
                ) : (
                  <div className="w-4 h-4"></div>
                )}
              </button>

              {loading ? (
                <div className="w-24 flex justify-center text-slate-400">
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                </div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <div className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                    <i className="fa-solid fa-star"></i>
                    {user.points} Puan
                  </div>
                  <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-brand-primary overflow-hidden border border-slate-200 dark:border-slate-600">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0D8B63&color=fff`} 
                        alt="Profil" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{user.username}</span>
                  </Link>
                  <button onClick={handleLogout} title="Çıkış Yap" className="text-slate-400 hover:text-red-500 transition-colors">
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="bg-brand-primary hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md">
                  <i className="fa-solid fa-right-to-bracket mr-2"></i> 
                  <span>Giriş Yap</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/" onClick={() => setIsOpen(false)} className={`block py-2 ${getLinkStyle('/')}`}>Ana Sayfa</Link></li>
              <li><Link href="/challenges" onClick={() => setIsOpen(false)} className={`block py-2 ${getLinkStyle('/challenges')}`}>Challenges</Link></li>
              <li><Link href="/leaderboard" onClick={() => setIsOpen(false)} className={`block py-2 ${getLinkStyle('/leaderboard')}`}>Leaderboard</Link></li>

              <li className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium py-2">Tema Seçimi</span>
                <button onClick={toggleTheme} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg w-10 h-10 flex items-center justify-center">
                   {mounted ? (
                     theme === 'dark' ? <i className="fa-solid fa-moon text-slate-400"></i> : <i className="fa-solid fa-sun text-amber-500"></i>
                   ) : null}
                </button>
              </li>

              <li className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                {loading ? (
                   <div className="py-2 text-center text-slate-400"><i className="fa-solid fa-circle-notch fa-spin"></i> Yükleniyor...</div>
                ) : user ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="flex items-center gap-3 font-semibold">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0D8B63&color=fff`} 
                          alt="Profil" 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600 bg-slate-200 dark:bg-slate-700"
                        />
                        <span>{user.username}</span>
                      </div>
                      <div className="text-brand-primary font-bold">{user.points} Puan</div>
                    </div>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="block w-full text-center border border-brand-primary text-brand-primary py-2 rounded-lg font-medium hover:bg-brand-primary/10">
                      Profilime Git
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded-lg font-medium mt-1">
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-brand-primary text-white py-2 rounded-lg font-medium mt-2">
                    Giriş Yap
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}