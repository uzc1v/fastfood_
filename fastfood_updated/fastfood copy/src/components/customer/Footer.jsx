import React from 'react';
import { Flame, MapPin, Phone, Clock, Instagram, Send } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  return (
    <footer className="bg-red-950 text-white pt-16 pb-10 mt-20 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-red-900">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-950 fill-red-950" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                FLAME<span className="text-amber-400">BITES</span>
              </span>
            </div>
            <p className="text-sm text-red-200/80 leading-relaxed">
              Zamonaviy street-food madaniyati va premium sifat. Har kuni yangi masalliqlardan tayyorlanadigan maxsus taomlar.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg text-amber-400 mb-4">
              Kategoriyalar
            </h4>
            <ul className="space-y-2.5 text-sm text-red-100/85">
              {['Barchasi', 'Hotdog', 'Lavash', 'Burger'].map((cat) => (
                <li key={cat}>
                  <a
                    href="#menu-section"
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg text-amber-400 mb-4">
              Aloqa va Manzil
            </h4>
            <ul className="space-y-3 text-sm text-red-100/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Toshkent sh., Amir Temur shoh ko‘chasi, 45-uy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+998712000000" className="hover:text-amber-400">
                  +998 71 200-00-00
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Har kuni: 10:00 — 02:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg text-amber-400 mb-4">
              Ijtimoiy tarmoqlar
            </h4>
            <p className="text-sm text-red-200/80 mb-4">
              Yangi aksiyalar va maxsus chegirmalardan xabardor bo‘ling.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#top"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-red-900 hover:bg-amber-400 text-amber-300 hover:text-red-950 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#top"
                aria-label="Telegram"
                className="w-10 h-10 rounded-xl bg-red-900 hover:bg-amber-400 text-amber-300 hover:text-red-950 flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-red-300/70 gap-3">
          <p>© {new Date().getFullYear()} FLAMEBITES. Barcha huquqlar himoyalangan.</p>
          <p>Premium Fast Food Platform</p>
        </div>
      </div>
    </footer>
  );
}