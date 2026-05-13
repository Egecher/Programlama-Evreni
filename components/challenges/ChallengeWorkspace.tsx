"use client";

import { useState, useEffect, useRef } from 'react';

interface ChallengeWorkspaceProps {
  challengeId: string;
  durationSeconds: number;
  type: 'code' | 'quiz';
  options?: string[];
  initialStatus: string;
  challengePoints?: number;
  isReadOnly?: boolean;
  submittedAnswer?: string;
  correctAnswer?: string;
  timeSpentStr?: string;
}

export default function ChallengeWorkspace({
  challengeId,
  durationSeconds,
  type,
  options = [],
  initialStatus,
  isReadOnly = false,
  submittedAnswer = "",
  correctAnswer = "",
  timeSpentStr = ""
}: ChallengeWorkspaceProps) {

  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [selectedOption, setSelectedOption] = useState(type === 'quiz' ? submittedAnswer : "");
  const [code, setCode] = useState(type === 'code' ? submittedAnswer : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocalFinished, setIsLocalFinished] = useState(false);
  const hasStartedRef = useRef(false);

  const isAlreadyFinished = initialStatus === 'Başarılı' || initialStatus === 'Hatalı' || initialStatus === 'Süre Doldu';
  const isDone = isAlreadyFinished || isLocalFinished || isReadOnly;
  const isTimeUp = timeLeft <= 0 && !isReadOnly;

  const [result, setResult] = useState<{ status: 'success' | 'error' | null, message: string }>({
    status: isAlreadyFinished ? (initialStatus === 'Başarılı' ? 'success' : 'error') : null,
    message: isAlreadyFinished ? `Bu soruyu zaten tamamladın. Durum: ${initialStatus}` : ''
  });

  useEffect(() => {
    if (isDone) return;

    if (initialStatus === 'Not Started' && !isLocalFinished && !hasStartedRef.current) {
      hasStartedRef.current = true;
      fetch(`/api/challenges/${challengeId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Sınav devam ediyor! Çıkarsan süren arka planda işlemeye devam edecek. Emin misin?";
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [challengeId, initialStatus, isDone, isLocalFinished]);

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const m = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
    const s = (safeSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = async () => {
    if (isReadOnly) return;

    if (type === 'code' && !code.trim()) {
      setResult({ status: 'error', message: 'Boş kod gönderilmez, bir şeyler yaz!' }); return;
    }
    if (type === 'quiz' && !selectedOption) {
      setResult({ status: 'error', message: 'Lütfen bir şık seç!' }); return;
    }

    setIsSubmitting(true);
    setResult({ status: null, message: '' });

    try {
      const res = await fetch(`/api/challenges/${challengeId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit', answer: type === 'quiz' ? selectedOption : code })
      });
      const data = await res.json();

      setResult({ status: data.status, message: data.message });

      if (res.ok || data.status === 'error' || data.status === 'success') {
        setIsLocalFinished(true);
      }
    } catch {
      setResult({ status: 'error', message: 'Sunucuya bağlanılamadı!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl relative">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-700 gap-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-300">
          <i className={`fa-solid ${type === 'code' ? 'fa-terminal' : 'fa-list-ul'} text-brand-primary`}></i>
          {isReadOnly ? 'Çözüm Sonucu (Sadece Okunur)' : (type === 'code' ? 'Çözüm Çalışma Alanı' : 'Test Alanı')}
        </div>

        <div className={`font-mono text-sm md:text-lg font-bold flex items-center gap-2 px-3 py-1 rounded-lg ${
          isReadOnly ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
          isTimeUp ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
          timeLeft < 60 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 animate-pulse' : 
          'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white'
        }`}>
          {isReadOnly ? (
            <><i className="fa-solid fa-flag-checkered"></i> Süren: {timeSpentStr || '--:--'}</>
          ) : (
            <><i className="fa-solid fa-stopwatch"></i> {isDone ? '--:--' : formatTime(timeLeft)}</>
          )}
        </div>
      </div>

      {(isTimeUp && !isReadOnly && !isLocalFinished) && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-3 text-sm font-bold border-b border-red-200 dark:border-red-800 flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-lg"></i>
          Süren doldu! Cevabını gönderip pratik yapabilirsin ancak bu sorudan puan alamayacaksın.
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 p-6 relative">
        {type === 'code' ? (
          <textarea value={code} onChange={(e) => setCode(e.target.value)} disabled={isDone} spellCheck="false" 
            className={`w-full h-80 font-mono p-4 rounded-lg focus:outline-none resize-y text-sm leading-relaxed ${
              isReadOnly 
                ? "bg-slate-100 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700" 
                : "bg-[#1e1e1e] text-[#d4d4d4]"
            }`}
            placeholder="// Kodunuzu buraya yazın..."
          />
        ) : (
          <div className="space-y-3">
            {options.map((opt, index) => {
              let optionClass = 'border-slate-200 dark:border-slate-700';
              if (isReadOnly) {
                if (opt === correctAnswer) {
                  optionClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
                } else if (opt === selectedOption && opt !== correctAnswer) {
                  optionClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
                } else {
                  optionClass = 'border-slate-200 dark:border-slate-700 opacity-50';
                }
              } else if (selectedOption === opt) {
                optionClass = 'border-brand-primary bg-brand-primary/5';
              }

              return (
                <label key={index} className={`flex items-center p-4 border rounded-xl transition-colors ${optionClass} ${isDone ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}>
                  <input type="radio" value={opt} checked={selectedOption === opt} onChange={(e) => setSelectedOption(e.target.value)} disabled={isDone} 
                    className="w-5 h-5 text-brand-primary" />
                  <span className={`ml-3 font-medium ${isReadOnly && opt === correctAnswer ? 'font-bold' : ''}`}>
                    {opt}
                    {isReadOnly && opt === correctAnswer && <i className="fa-solid fa-check ml-2"></i>}
                    {isReadOnly && opt === selectedOption && opt !== correctAnswer && <i className="fa-solid fa-xmark ml-2"></i>}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full text-center sm:text-left">
          {result.status && (
            <div className={`text-sm font-bold flex items-center justify-center sm:justify-start gap-2 ${result.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              <i className={`fa-solid ${result.status === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation'}`}></i>
              {result.message}
            </div>
          )}
        </div>

        {!isReadOnly && (
          <button onClick={handleSubmit} disabled={isSubmitting || isDone} className="shrink-0 w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-brand-primary hover:bg-green-700 disabled:bg-slate-400 shadow-md transition-all flex items-center justify-center gap-2">
            {isSubmitting ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Gönderiliyor...</> : <><i className="fa-solid fa-paper-plane"></i> Cevabı Gönder</>}
          </button>
        )}
      </div>

    </div>
  );
}