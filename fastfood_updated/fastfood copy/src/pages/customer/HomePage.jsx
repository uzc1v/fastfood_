import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Sparkles } from 'lucide-react';
import Navbar from '../../components/customer/Navbar';
import Hero from '../../components/customer/Hero';
import ProductCard from '../../components/customer/ProductCard';
import ProductDetailModal from '../../components/customer/ProductDetailModal';
import Footer from '../../components/customer/Footer';
import VisitorGateModal from '../../components/customer/VisitorGateModal';
import { apiService } from '../../services/api';

const CATEGORIES = ['Barchasi', 'Hotdog', 'Lavash', 'Burger'];
const VISITOR_KEY = 'flamebites_visitor';

function loadSavedVisitor() {
  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    const v = raw ? JSON.parse(raw) : null;
    return v?.firstName && v?.lastName && v?.phone ? v : null;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visitor, setVisitor] = useState(loadSavedVisitor);

  const handleVisitorSubmitted = (data) => {
    try {
      localStorage.setItem(VISITOR_KEY, JSON.stringify(data));
    } catch {
      /* brauzer saqlashga ruxsat bermasa ham sayt ishlayveradi */
    }
    setVisitor(data);
  };

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    apiService
      .getProducts(activeCategory)
      .then((data) => {
        if (!ignore) setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <main className="flex-1">
        <Hero />

        <section
          id="menu-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 scroll-mt-24"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-red-800 font-bold text-sm uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Issiq va mazali menyu</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-900">
                Bizning <span className="text-red-800">Taomlar</span> Katalogi
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`relative px-6 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-red-800 text-amber-300 shadow-lg shadow-red-900/25'
                        : 'bg-amber-50 hover:bg-amber-100 text-neutral-800 border border-amber-200/80'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="rounded-3xl border border-neutral-100 overflow-hidden bg-white shadow-sm animate-pulse"
                >
                  <div className="aspect-[4/3] bg-amber-100/70" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-neutral-200 rounded-xl w-3/4" />
                    <div className="h-4 bg-neutral-100 rounded-lg w-full" />
                    <div className="h-4 bg-neutral-100 rounded-lg w-2/3" />
                    <div className="pt-4 flex justify-between items-center">
                      <div className="h-7 bg-red-100 rounded-xl w-24" />
                      <div className="h-10 bg-amber-200/70 rounded-2xl w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-4 rounded-[2.5rem] bg-amber-50/60 border-2 border-dashed border-amber-200"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-black text-neutral-900">
                Hozircha bu kategoriyada taomlar yo‘q
              </h3>
              <p className="text-neutral-500 max-w-md mx-auto mt-2 text-sm">
                Tez orada yangi mazali taomlar qo‘shiladi. Boshqa kategoriyalarni ko‘rib chiqishingiz mumkin.
              </p>
              {activeCategory !== 'Barchasi' && (
                <button
                  onClick={() => setActiveCategory('Barchasi')}
                  className="mt-6 px-6 py-3 rounded-2xl bg-red-800 text-amber-300 font-bold text-sm hover:bg-red-900 transition-colors cursor-pointer"
                >
                  Barcha taomlarni ko‘rish
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>

      <Footer onSelectCategory={setActiveCategory} />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {!visitor && <VisitorGateModal onSubmitted={handleVisitorSubmitted} />}
    </div>
  );
}