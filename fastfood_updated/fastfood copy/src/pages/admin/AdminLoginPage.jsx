import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Flame, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch {
      navigate('/', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-neutral-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl border border-amber-300/40"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-900 flex items-center justify-center shadow-lg shadow-red-900/30 mb-4">
            <Flame className="w-8 h-8 text-amber-400 fill-amber-400" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900">
            Admin Boshqaruvi
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Davom etish uchun admin ma’lumotlarini kiriting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Login
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Loginni kiriting"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:bg-white focus:outline-none font-medium text-neutral-900 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Parol
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:bg-white focus:outline-none font-medium text-neutral-900 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-red-800 hover:bg-red-900 disabled:opacity-60 text-amber-300 font-extrabold py-4 rounded-2xl shadow-lg shadow-red-900/25 transition-all active:scale-95 cursor-pointer"
          >
            <span>{submitting ? 'Tekshirilmoqda...' : 'Tizimga kirish'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}