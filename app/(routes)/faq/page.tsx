"use client";

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: "Programlama Evreni tamamen ücretsiz mi?",
      answer: "Evet, platformumuzdaki tüm kodlama soruları, quizler ve eğitim içerikleri tamamen ücretsizdir. Amacımız herkesin yazılım yeteneklerini geliştirmesine katkı sağlamaktır."
    },
    {
      question: "Kazandığım puanlar ne işe yarıyor?",
      answer: "Çözdüğünüz sorulardan kazandığınız puanlar, Genel Liderlik Tablosu'nda (Leaderboard) yükselmenizi sağlar. Ayrıca belirli puan barajlarını aştıkça profilinize özel rozetler (Davet Ustası, Kodlama Uzmanı vb.) eklenir."
    },
    {
      question: "Soru çözerken sürem dolarsa ne olur?",
      answer: "Süreniz dolsa bile pratik yapmak amacıyla cevabınızı gönderebilir ve doğru/yanlış durumunu görebilirsiniz. Ancak adaletli bir rekabet ortamı için süre dolduktan sonra gönderilen cevaplardan puan kazanamazsınız."
    },
    {
      question: "Kodlama soruları nasıl değerlendiriliyor?",
      answer: "Kodlama sorularında yazdığınız algoritmalar arka planda test senaryolarından geçirilir. Eğer kodunuz tüm test senaryolarını başarıyla geçerse soru 'Başarılı' sayılır ve puan hesabınıza yansır."
    },
    {
      question: "Profil bilgilerimi ve şifremi nasıl güncelleyebilirim?",
      answer: "Sisteme giriş yaptıktan sonra sağ üstteki menüden profilinize gidebilir, 'Ayarlar' sekmesinden hem kişisel bilgilerinizi hem de şifrenizi güvenli bir şekilde güncelleyebilirsiniz."
    },
    {
      question: "Arkadaşımı nasıl davet edebilirim?",
      answer: (
        <>
          Kayıt olurken size özel oluşturulan Davet Kodu&apos;nu arkadaşlarınızla paylaşabilirsiniz. Arkadaşınız bu kodla kayıt olduğunda sistem bunu algılar. 5 kişiyi başarıyla davet ettiğinizde sistem size ekstra <strong>+100 Puan</strong> ve <strong>Davet Ustası</strong> rozeti hediye eder.
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-6 text-3xl">
            <i className="fa-solid fa-circle-question"></i>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Aklınıza takılan soruların cevaplarını burada bulabilirsiniz. Başka bir sorunuz varsa bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-brand-primary/50 bg-white dark:bg-slate-800 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-brand-primary/30'
                }`}>
                <button onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                  <span className={`font-bold text-lg pr-4 ${isOpen ? 'text-brand-primary' : 'text-slate-800 dark:text-slate-200'}`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 ${isOpen ? 'bg-brand-primary/10 text-brand-primary rotate-180' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0' }`}>
                  <div className="p-6 pt-2 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-linear-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cevabını bulamadın mı?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Daha fazla yardıma ihtiyacın varsa destek ekibimize ulaşabilir veya hemen kodlamaya başlayabilirsin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/challenges" className="w-full sm:w-auto bg-brand-primary hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              <i className="fa-solid fa-code"></i> Soruları Çöz
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}