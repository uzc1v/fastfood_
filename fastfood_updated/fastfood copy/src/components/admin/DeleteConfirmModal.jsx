import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({ product, deleting, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-100 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="font-display text-xl font-black text-neutral-900">
              Haqiqatan ham ushbu mahsulotni o‘chirmoqchimisiz?
            </h3>
            <p className="text-sm text-neutral-500 mt-2">
              <span className="font-bold text-neutral-800">«{product.name}»</span> bazadan butunlay o‘chiriladi va mijozlar saytidan ham olib tashlanadi.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={deleting}
                className="py-3 rounded-xl font-bold text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => onConfirm(product.id)}
                disabled={deleting}
                className="py-3 rounded-xl font-extrabold text-sm bg-red-700 hover:bg-red-800 text-white shadow-md transition-colors cursor-pointer"
              >
                {deleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}