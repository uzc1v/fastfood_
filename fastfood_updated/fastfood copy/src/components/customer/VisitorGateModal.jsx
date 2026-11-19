import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { formatPhoneLocal } from '../../utils/formatters';

/**
 * Saytga kirgan har bir mijozdan ism, familiya va telefon so'raydi.
 * Yopib bo'lmaydi: ma'lumot yuborilmaguncha sayt ochilmaydi.
 */
export default function VisitorGateModal({ onSubmitted }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Oyna ochiq turganda orqa sahifa aylanmasin.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      return setError('Ism va familiyangizni kiriting.');
    }
    if (phone.replace(/\D/g, '').length !== 9) {
      return setError("Telefon raqamini to'liq kiriting (9 ta raqam).");
    }

    setSubmitting(true);
    try {
      const visitor = await apiService.registerVisitor({
        firstName,
        lastName,
        phone: `+998${phone.replace(/\D/g, '')}`,
      });
      onSubmitted(visitor);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 text-neutral-900 font-semibold placeholder:text-neutral-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-red-800/15 focus:border-red-800 transition';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visitor-gate-title"
    >
      <div className="fixed inset-0 bg-red-950/80 backdrop-blur-md" />

      <motion.form
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="relative z-10 w-full max-w-md my-auto bg-white rounded-[2rem] shadow-2xl border border-amber-200 overflow-hidden"
      >
        <div className="bg-gradient-to-br from-red-800 to-red-950 px-7 pt-8 pb-7 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-black/20">
            <Flame className="w-8 h-8 text-red-950 fill-red-950" />
          </div>
          <h2
            id="visitor-gate-title"
            className="font-display text-2xl font-black text-white mt-4"
          >
            FLAME<span className="text-amber-400">BITES</span> ga xush kelibsiz!
          </h2>
          <p className="text-sm text-red-100/80 mt-1.5">
            Menyuni ko‘rish uchun o‘zingiz haqingizda ma’lumot qoldiring
          </p>
        </div>

        <div className="px-7 py-6 space-y-4">
          <div>
            <label htmlFor="vg-first" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Ism
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-red-800 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="vg-first"
                type="text"
                autoComplete="given-name"
                autoFocus
                maxLength={40}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Masalan: Jasur"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="vg-last" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Familiya
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-red-800 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="vg-last"
                type="text"
                autoComplete="family-name"
                maxLength={40}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Masalan: Karimov"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="vg-phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Telefon raqam
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-red-800 absolute left-4 top-1/2 -translate-y-1/2" />
              <span className="absolute left-11 top-1/2 -translate-y-1/2 font-bold text-neutral-800 select-none">
                +998
              </span>
              <input
                id="vg-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(formatPhoneLocal(e.target.value))}
                placeholder="90 123-45-67"
                className={`${inputClass} !pl-[5.25rem]`}
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 text-sm font-semibold text-red-800 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-red-800 hover:bg-red-900 disabled:opacity-60 disabled:cursor-not-allowed text-amber-300 font-extrabold py-3.5 rounded-2xl shadow-lg shadow-red-900/25 transition-all active:scale-[0.98] cursor-pointer"
          >
            {submitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <span>Menyuni ko‘rish</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-neutral-400 leading-snug">
            Ma’lumotlaringiz faqat buyurtma bo‘yicha siz bilan bog‘lanish uchun ishlatiladi.
          </p>
        </div>
      </motion.form>
    </div>
  );
}
