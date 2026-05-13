/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface UserData {
  username: string;
  email: string;
  points: number;
  level: number;
  avatar?: string;
}

interface ChallengeRef {
  _id: string;
  title: string;
  logo: string;
}

interface CompletedChallenge {
  challenge: ChallengeRef | null;
  status: string;
  completedAt: string;
  earnedPoints: number;
}

interface ProfileData {
  points: number;
  level: number;
  completedChallenges: CompletedChallenge[];
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const currentUser = user as UserData | null;
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [settingsStatus, setSettingsStatus] = useState({ type: '', message: '' });
  const [profileForm, setProfileForm] = useState({ email: '', avatarUrl: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        if (data) {
           setProfileForm(prev => ({
             ...prev,
             avatarUrl: data.avatar || prev.avatarUrl
           }));
        }
      }
    } catch (err) {
      console.error("Profil verisi çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
      setProfileForm({
        email: currentUser.email || '',
        avatarUrl: currentUser.avatar || ''
      });
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [currentUser, authLoading, fetchProfile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setSettingsStatus({ type: 'error', message: 'Dosya çok büyük! (Maksimum 2MB)' });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      setProfileForm(prev => ({ ...prev, avatarUrl: base64 }));

      try {
        setSettingsStatus({ type: 'info', message: 'Resim sunucuya yükleniyor...' });
        const res = await fetch('/api/user/upload-avatar', {
          method: 'POST',
          body: JSON.stringify({ image: base64 }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
          const data = await res.json();
          setProfileForm(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
          setSettingsStatus({ type: 'success', message: 'Profil resmi başarıyla güncellendi!' });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setSettingsStatus({ type: 'error', message: 'Resim yüklenemedi.' });
        }
      } catch (err) {
        console.error(err);
        setSettingsStatus({ type: 'error', message: 'Sunucuya bağlanılamadı.' });
      }
    };
  };

  // E-Posta Güncelleme
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus({ type: 'info', message: 'Bilgiler güncelleniyor...' });

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profileForm.email,
          avatarUrl: profileForm.avatarUrl
        })
      });

      if (res.ok) {
        setSettingsStatus({ type: 'success', message: 'Profil bilgilerin başarıyla güncellendi!' });
      } else {
        const data = await res.json();
        setSettingsStatus({ type: 'error', message: data.error || 'Güncelleme başarısız.' });
      }
    } catch (err) {
      console.error(err);
      setSettingsStatus({ type: 'error', message: 'Bağlantı hatası oluştu.' });
    }
  };

  // Şifre Güncelleme
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSettingsStatus({ type: 'error', message: 'Yeni şifreler eşleşmiyor!' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setSettingsStatus({ type: 'error', message: 'Şifre en az 8 karakter olmalıdır.' });
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      setSettingsStatus({ type: 'error', message: 'Şifreniz en az 1 harf ve 1 rakam içermelidir.' });
      return;
    }

    setSettingsStatus({ type: 'info', message: 'Şifre güncelleniyor...' });

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Şifre güncellenirken bir hata oluştu.');
      }

      setSettingsStatus({ type: 'success', message: 'Şifre başarıyla değiştirildi!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error: unknown) {
      if (error instanceof Error) {
        setSettingsStatus({ type: 'error', message: error.message });
      } else {
        setSettingsStatus({ type: 'error', message: 'Bilinmeyen bir hata oluştu.' });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'profile' | 'password') => {
    const { name, value } = e.target;
    if (formType === 'profile') {
      setProfileForm(prev => ({ ...prev, [name]: value }));
    } else {
      setPasswordForm(prev => ({ ...prev, [name]: value }));
    }
  };

  if (authLoading || loading) return (
    <div className="flex justify-center items-center h-[60vh] text-brand-primary">
      <i className="fa-solid fa-circle-notch fa-spin text-4xl"></i>
    </div>
  );

  if (!currentUser) return (
    <div className="flex flex-col justify-center items-center h-[60vh]">
      <i className="fa-solid fa-lock text-6xl text-slate-300 mb-4"></i>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Giriş yapmalısın.</h2>
      <Link href="/login" className="mt-6 bg-brand-primary text-white px-6 py-2 rounded-full font-bold">Giriş Yap</Link>
    </div>
  );

  const successfulChallenges = profileData?.completedChallenges?.filter((c: CompletedChallenge) => c.status === 'Başarılı' && c.challenge) || [];
  const displayAvatar = profileForm.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username}&background=0D8B63&color=fff&size=128`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl text-slate-900 dark:text-white">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-brand-primary/20 bg-slate-100 dark:bg-slate-800 shrink-0">
          <img 
            src={displayAvatar} 
            alt="Profil" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=0D8B63&color=fff`;
            }}
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{currentUser.username}</h1>
          <p className="text-slate-500 mb-4">{profileForm.email || currentUser.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 font-bold text-sm">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl">★ {profileData?.points || currentUser.points} Puan</span>
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl">✓ {successfulChallenges.length} Soru</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
        <button onClick={() => setActiveTab('profile')} className={`pb-4 px-6 font-bold ${activeTab === 'profile' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-slate-500'}`}>İstatistikler</button>
        <button onClick={() => setActiveTab('settings')} className={`pb-4 px-6 font-bold ${activeTab === 'settings' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-slate-500'}`}>Ayarlar</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800">
        {activeTab === 'profile' && (
          <div>
            <h3 className="text-xl font-bold mb-6">Son Çözülen Sorular</h3>
            {successfulChallenges.length === 0 ? (
              <p className="text-slate-500 py-8 text-center">Henüz bir soru çözmedin.</p>
            ) : (
              <div className="space-y-4">
                {successfulChallenges.slice().reverse().map((record, index) => (
                  <Link href={`/challenges/${record.challenge?._id}?view=true`} key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-brand-primary transition-all">
                    <div className="flex items-center gap-4">
                      <img src={record.challenge?.logo} alt="logo" className="w-10 h-10 object-contain" />
                      <div>
                        <p className="font-bold">{record.challenge?.title}</p>
                        <p className="text-xs text-slate-500">{new Date(record.completedAt).toLocaleDateString('tr-TR')} • +{record.earnedPoints} Puan</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-slate-400"></i>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            {settingsStatus.message && (
              <div className={`mb-6 p-4 rounded-xl font-bold ${settingsStatus.type === 'error' ? 'bg-red-100 text-red-700' : settingsStatus.type === 'info' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{settingsStatus.message}</div>
            )}
            <form className="space-y-6 mb-10" onSubmit={handleProfileUpdate}>
              <h3 className="text-xl font-bold border-b pb-2">Genel Bilgiler</h3>
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Profil Fotoğrafı Yükle</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <img src={profileForm.avatarUrl || displayAvatar} alt="preview" className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=0D8B63&color=fff`;
                      }}
                    />
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-green-700 cursor-pointer w-full" />
                </div>
                <p className="text-xs text-slate-500 mt-2">Maksimum 2MB boyutunda resim yükleyebilirsiniz.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">E-posta</label>
                <input type="email" name="email" value={profileForm.email} onChange={(e) => handleInputChange(e, 'profile')} required className="w-full p-3 rounded-xl border dark:bg-slate-800 focus:outline-brand-primary" />
              </div>
              <button type="submit" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3 rounded-xl font-bold">Bilgileri Kaydet</button>
            </form>

            <form className="space-y-6" onSubmit={handlePasswordUpdate}>
              <h3 className="text-xl font-bold border-b pb-2">Şifre Değiştir</h3>
              <div>
                <label className="block text-sm font-bold mb-2">Mevcut Şifre</label>
                <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={(e) => handleInputChange(e, 'password')} required className="w-full p-3 rounded-xl border dark:bg-slate-800" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={(e) => handleInputChange(e, 'password')} required placeholder="Yeni Şifre" className="w-full p-3 rounded-xl border dark:bg-slate-800" />
                <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={(e) => handleInputChange(e, 'password')} required placeholder="Tekrar" className="w-full p-3 rounded-xl border dark:bg-slate-800" />
              </div>
              <button type="submit" className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold">Şifreyi Güncelle</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}