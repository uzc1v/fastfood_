import React, { useState, useEffect } from 'react';
import { Flame, PhoneCall, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ activeCategory, onSelectCategory }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories = ['Barchasi', 'Hotdog', 'Lavash', 'Burger'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCatClick = (cat) => {
    onSelectCategory(cat);
    setMobileOpen(false);
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-red-950/5 border-b border-amber-100 py-3'
          : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-800 to-red-950 flex items-center justify-center shadow-md shadow-red-900/25 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <span className="font-display font-black text-2xl tracking-tight text-red-900">
              FLAME<span className="text-amber-500">BITES</span>
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 -mt-1">
              Premium Street Grill
            </p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-2 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-200/60">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCatClick(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-800 text-amber-300 shadow-sm'
                    : 'text-neutral-700 hover:text-red-800 hover:bg-white/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href="tel:+998712000000"
            className="flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-red-950 font-bold px-5 py-2.5 rounded-2xl shadow-md shadow-amber-400/30 transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-red-900" />
            <span>+998 71 200-00-00</span>
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-xl bg-red-50 text-red-900 hover:bg-red-100"
          aria-label="Menyuni ochish"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-amber-100 px-4 pt-3 pb-5 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCatClick(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center justify-between ${
                    activeCategory === cat
                      ? 'bg-red-800 text-amber-300'
                      : 'bg-neutral-50 text-neutral-800'
                  }`}
                >
                  <span>{cat}</span>
                  {activeCategory === cat && <Sparkles className="w-4 h-4" />}
                </button>
              ))}
              <a
                href="tel:+998712000000"
                className="mt-2 w-full flex items-center justify-center gap-2 bg-amber-400 text-red-950 font-extrabold py-3 rounded-xl"
              >
                <PhoneCall className="w-4 h-4" />
                <span>+998 71 200-00-00</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}