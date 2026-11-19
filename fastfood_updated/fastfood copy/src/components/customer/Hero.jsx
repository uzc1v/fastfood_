import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowDownRight, Clock, Award, Sparkles } from 'lucide-react';

export default function Hero() {
  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-br from-white via-amber-50/60 to-red-50/40"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-80 h-80 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900 text-amber-300 text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-red-950/15"
            >
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>100% HALOL &amp; YANGI GO‘SHTDAN TAYYORLANADI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 leading-[1.08] tracking-tight"
            >
              Haqiqiy Olovda Pishgan{' '}
              <span className="text-red-800 underline decoration-amber-400 decoration-wavy decoration-4 underline-offset-8">
                Premium
              </span>{' '}
              Fast Food
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed"
            >
              Shirali burgerlar, tandirda qizargan lavashlar va maxsus sousli hotdoglar — har bir luqmada unutilmas ta’m va yuqori sifat uyg‘unligi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={scrollToMenu}
                className="group flex items-center gap-3 bg-red-800 hover:bg-red-900 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-red-900/25 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span className="text-amber-300">Menyuni ko‘rish</span>
                <ArrowDownRight className="w-5 h-5 text-amber-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-amber-200 shadow-sm">
                <Clock className="w-5 h-5 text-red-800" />
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Yetkazish vaqti</p>
                  <p className="text-sm font-extrabold text-neutral-900">25–35 daqiqa</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-200/70 max-w-lg"
            >
              <div>
                <p className="font-display text-2xl font-black text-red-800">15K+</p>
                <p className="text-xs text-neutral-500 font-medium">Mamnun mijozlar</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-red-800">4.9 ★</p>
                <p className="text-xs text-neutral-500 font-medium">O‘rtacha baho</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-red-800">100%</p>
                <p className="text-xs text-neutral-500 font-medium">Tabiiy masalliqlar</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-[2.5rem] bg-gradient-to-tr from-red-900 via-red-800 to-amber-500 p-3 shadow-2xl shadow-red-950/20">
              <div className="overflow-hidden rounded-[2rem] bg-neutral-900 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85"
                  alt="Premium Double Burger"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 -left-4 sm:left-6 bg-white rounded-2xl p-4 shadow-xl border border-amber-200 flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center text-red-950">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-extrabold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CHEF TAVSIYASI</span>
                  </div>
                  <p className="font-display font-extrabold text-neutral-900">
                    Royal Double Grill
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}