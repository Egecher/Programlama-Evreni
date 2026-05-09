"use client";
import { useState, useEffect, useCallback } from 'react';

interface ChallengeItem {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
  type: 'code' | 'quiz';
  points: number;
  duration: number;
  description: string;
  options: string[];
  correctAnswer: string;
  logo: string;
  isFeatured: boolean;
  isWeekly: boolean;
  weekNumber?: string;
}

interface FormState {
  title: string;
  category: string;
  difficulty: string;
  description: string;
  points: number;
  duration: number;
  isWeekly: boolean;
  weekNumber: string;
  type: 'code' | 'quiz';
  options: string;
  correctAnswer: string;
  logo: string;
  isFeatured: boolean;
}

const initialFormState: FormState = {
  title: '', category: '', difficulty: 'Orta', description: '', points: 10, duration: 30,
  isWeekly: false, weekNumber: '', type: 'code', options: '', correctAnswer: '',
  logo: '', isFeatured: false 
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [availableLogos, setAvailableLogos] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchChallenges = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error("Sorular çekilemedi", error);
    }
  }, []);

  const fetchLogos = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/logos');
      if (res.ok) {
        const logos = await res.json();
        setAvailableLogos(logos);
      }
    } catch (error) {
      console.error("Logolar çekilemedi", error);
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      await fetchChallenges();
      await fetchLogos();
    };
    loadAllData();
  }, [fetchChallenges, fetchLogos]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu soruyu silmek istediğine emin misin?")) return;
    try {
      const res = await fetch(`/api/admin/challenges?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Soru silindi!' });
        fetchChallenges();
      }
    } catch {
      setStatus({ type: 'error', message: 'Silme işlemi başarısız.' });
    }
  };

  const handleEdit = (challenge: ChallengeItem) => {
    setFormData({
      title: challenge.title,
      category: challenge.category,
      difficulty: challenge.difficulty,
      description: challenge.description,
      points: challenge.points,
      duration: challenge.duration,
      isWeekly: challenge.isWeekly || false,
      weekNumber: challenge.weekNumber || '',
      type: challenge.type,
      options: challenge.options ? challenge.options.join(', ') : '',
      correctAnswer: challenge.correctAnswer || '',
      logo: challenge.logo,
      isFeatured: challenge.isFeatured || false
    });
    setEditingId(challenge._id);
    setActiveTab('form');
    setStatus({ type: '', message: '' });
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'İşlem yapılıyor...' });

    try {
      const payload = {
        ...formData,
        options: formData.type === 'quiz' 
          ? formData.options.split(',').map(opt => opt.trim()).filter(opt => opt !== '') 
          : [],
        correctAnswer: formData.type === 'quiz' ? formData.correctAnswer.trim() : ''
      };

      const url = editingId ? `/api/admin/challenges?id=${editingId}` : '/api/admin/challenges';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatus({ type: 'success', message: editingId ? 'Soru güncellendi!' : 'Yeni soru eklendi!' });
        resetForm();
        fetchChallenges();
        setActiveTab('list');
      } else {
        setStatus({ type: 'error', message: 'İşlem başarısız oldu!' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Bağlantı hatası!' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          <i className="fa-solid fa-screwdriver-wrench text-brand-primary mr-3"></i> 
          Yönetici Paneli
        </h1>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl font-bold ${status.type === 'error' ? 'bg-red-100 text-red-700' : status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {status.message}
        </div>
      )}

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
        <button onClick={() => setActiveTab('list')} className={`pb-4 px-6 font-bold text-lg transition-colors border-b-2 ${activeTab === 'list' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Tüm Sorular
        </button>
        <button onClick={() => { setActiveTab('form'); resetForm(); }} className={`pb-4 px-6 font-bold text-lg transition-colors border-b-2 ${activeTab === 'form' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          {editingId ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="p-4 font-bold">Başlık</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Zorluk</th>
                <th className="p-4 font-bold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map(challenge => (
                <tr key={challenge._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{challenge.title}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{challenge.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${challenge.difficulty === 'Kolay' ? 'bg-green-100 text-green-700' : challenge.difficulty === 'Orta' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {challenge.difficulty}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => handleEdit(challenge)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><i className="fa-solid fa-pen"></i></button>
                    <button onClick={() => handleDelete(challenge._id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <label className="block mb-2 font-bold">Başlık</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:outline-brand-primary" />
            </div>
            <div>
              <label className="block mb-2 font-bold">Logo Seçimi</label>
              <select name="logo" value={formData.logo} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:outline-brand-primary">
                <option value="">Seçiniz...</option>
                {availableLogos.map(logo => <option key={logo} value={`/images/logo/${logo}`}>{logo}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-bold">Soru Tipi</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-brand-primary font-bold bg-brand-primary/5 focus:outline-brand-primary">
                <option value="code">Kodlama Sorusu</option>
                <option value="quiz">Şıklı Test Sorusu</option>
              </select>
            </div>
            <div>
                <label className="block mb-2 font-bold">Kategori</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:outline-brand-primary" />
            </div>
            <div>
                <label className="block mb-2 font-bold">Zorluk</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:outline-brand-primary">
                    <option>Kolay</option>
                    <option>Orta</option>
                    <option>Zor</option>
                </select>
            </div>
          </div>

          {formData.type === 'quiz' && (
            <div className="p-6 border-2 border-dashed border-brand-primary/50 bg-brand-primary/5 rounded-xl space-y-4">
              <div>
                <label className="block mb-1 font-bold text-sm">Şıklar (Virgülle ayırın)</label>
                <input type="text" name="options" value={formData.options} onChange={handleChange} required className="w-full p-3 border rounded-xl dark:bg-slate-800 focus:outline-brand-primary" />
              </div>
              <div>
                <label className="block mb-1 font-bold text-sm">Doğru Cevap</label>
                <input type="text" name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} required className="w-full p-3 border rounded-xl dark:bg-slate-800 focus:outline-brand-primary" />
              </div>
            </div>
          )}

          <div>
            <label className="block mb-2 font-bold">Açıklama</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:outline-brand-primary" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-bold">Puan</label>
              <input type="number" name="points" value={formData.points} onChange={handleChange} required className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:outline-brand-primary" />
            </div>
            <div>
              <label className="block mb-2 font-bold">Süre (Dakika)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} required className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:outline-brand-primary" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-t border-b border-slate-200 dark:border-slate-800 py-6 my-4">
            <label className="flex items-center gap-3 font-bold cursor-pointer text-brand-primary">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-6 h-6 accent-brand-primary rounded" />
              Ana Sayfada Göster (Öne Çıkan)
            </label>

            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            <label className="flex items-center gap-3 font-bold cursor-pointer text-slate-700 dark:text-slate-300">
              <input type="checkbox" name="isWeekly" checked={formData.isWeekly} onChange={handleChange} className="w-6 h-6 accent-brand-primary rounded" />
              Bu Haftanın Sorusu Mu?
            </label>

            {formData.isWeekly && (
              <input type="text" name="weekNumber" value={formData.weekNumber} onChange={handleChange} placeholder="Örn: 2026-W18" className="p-2 border border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm w-36" />
            )}
          </div>

          <div className="flex gap-4">
            {editingId && <button type="button" onClick={resetForm} className="w-1/3 bg-slate-200 px-8 py-4 rounded-xl font-bold dark:bg-slate-800">İptal</button>}
            <button type="submit" className="flex-1 bg-brand-primary text-white font-bold py-4 rounded-xl shadow-md hover:bg-green-700 transition-colors">
              {editingId ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}