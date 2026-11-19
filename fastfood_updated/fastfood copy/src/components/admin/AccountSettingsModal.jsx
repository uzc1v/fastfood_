import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AccountSettingsModal({ isOpen, onClose }) {
  const { admin, updateAdminState } = useAuth();
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentUsername(admin?.username || '');
      setNewUsername(admin?.username || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  }, [isOpen, admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Yangi parol va tasdiqlash paroli mos kelmadi.');
      return;
    }

    setSaving(true);
    try {
      const res = await apiService.updateCredentials({
        currentUsername,
        newUsername,
        currentPassword,
        newPassword,
        confirmPassword,
      });
      updateAdminState(res.token, res.admin);
      setSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            className="relative z-10 bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-amber-200 overflow-hidden my-8"
          >
            <div className="px-6 py-5 bg-red-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h2 className="font-display text-lg font-black text-amber-300">
                  Profil va hisob sozlamalari
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-red-800 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">
                  Hozirgi login
                </label>
                <input
                  type="text"
                  required
                  value={currentUsername}
                  onChange={(e) => setCurrentUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">
                  Yangi login
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">
                  Hozirgi parol
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">
                  Yangi parol
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">
                  Yangi parolni tasdiqlash
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Yangi parolni qayta kiriting"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:outline-none text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Yopish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-800 hover:bg-red-900 text-amber-300 text-sm font-extrabold shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}