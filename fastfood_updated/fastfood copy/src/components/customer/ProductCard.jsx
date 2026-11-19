import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Flame } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function ProductCard({ product, index, onViewDetails }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      className="group bg-white rounded-3xl border border-neutral-200/80 hover:border-amber-400 shadow-sm hover:shadow-2xl hover:shadow-red-950/10 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-amber-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-red-900/95 text-amber-300 backdrop-blur-sm shadow-md">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {product.category}
        </span>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl font-extrabold text-neutral-900 group-hover:text-red-800 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-neutral-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
              Narxi
            </span>
            <span className="font-display text-lg sm:text-xl font-black text-red-800">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(product)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-red-800 text-red-950 hover:text-amber-300 font-bold text-sm transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Batafsil ko‘rish</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}