import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, PhoneCall, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function ProductDetailModal({ product, onClose }) {
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/65 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative z-10 bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-amber-200"
          >
            <button
              onClick={onClose}
              aria-label="Yopish"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-red-800 text-neutral-900 hover:text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-12">
              <div className="md:col-span-6 bg-amber-50 aspect-square md:aspect-auto">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-900 text-amber-300">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    {product.category}
                  </span>

                  <h2 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 mt-3 leading-tight">
                    {product.name}
                  </h2>

                  <p className="font-display text-2xl font-black text-red-800 mt-3">
                    {formatPrice(product.price)}
                  </p>

                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Mahsulot tarkibi va tavsifi
                    </h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Buyurtma berilganda issiq holda tayyorlanadi</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col gap-2.5">
                  <a
                    href="tel:+998712000000"
                    className="w-full flex items-center justify-center gap-2 bg-red-800 hover:bg-red-900 text-amber-300 font-extrabold py-3.5 rounded-2xl shadow-lg shadow-red-900/20 transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Buyurtma uchun qo‘ng‘iroq qilish</span>
                  </a>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}