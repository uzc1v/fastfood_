import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Plus,
  Pencil,
  Trash2,
  Settings,
  LogOut,
  PackageOpen,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { formatPrice } from '../../utils/formatters';
import ProductFormModal from '../../components/admin/ProductFormModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import AccountSettingsModal from '../../components/admin/AccountSettingsModal';
import VisitorsPanel from '../../components/admin/VisitorsPanel';

const CATEGORIES = ['Barchasi', 'Hotdog', 'Lavash', 'Burger'];

export default function AdminDashboardPage() {
  const { admin, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState('products');
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducts(activeCategory);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (formData, productId) => {
    if (productId) {
      await apiService.updateProduct(productId, formData);
    } else {
      await apiService.createProduct(formData);
    }
    await fetchProducts();
  };

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await apiService.deleteProduct(id);
      setDeletingProduct(null);
      await fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-red-950 text-white sticky top-0 z-30 border-b border-red-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center">
              <Flame className="w-6 h-6 text-red-950 fill-red-950" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl tracking-tight">
                FLAME<span className="text-amber-400">BITES</span>{' '}
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-red-800 text-amber-300 ml-1">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-red-200/80">
                Xush kelibsiz, <span className="font-bold text-white">{admin?.username}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-900 hover:bg-red-800 text-amber-200 text-sm font-bold transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Profil va sozlamalar</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 text-sm font-extrabold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-neutral-200 shadow-sm mb-6">
          {[
            { id: 'products', label: 'Mahsulotlar', Icon: UtensilsCrossed },
            { id: 'visitors', label: 'Mijozlar', Icon: Users },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                tab === id
                  ? 'bg-red-950 text-amber-300 shadow-sm'
                  : 'text-neutral-700 hover:bg-amber-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'visitors' ? (
          <VisitorsPanel />
        ) : (
        <>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-neutral-200 shadow-sm">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-red-800 text-amber-300 shadow-sm'
                    : 'text-neutral-700 hover:bg-amber-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-red-800 hover:bg-red-900 text-amber-300 font-extrabold text-sm shadow-lg shadow-red-900/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Mahsulot qo‘shish</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-white border border-neutral-200 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-16 text-center">
            <PackageOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-neutral-800">
              Ushbu kategoriyada mahsulot topilmadi
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Yangi mahsulot qo‘shish uchun yuqoridagi «Mahsulot qo‘shish» tugmasini bosing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold bg-red-900 text-amber-300">
                    {product.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-extrabold text-neutral-900">
                        {product.name}
                      </h3>
                      <span className="font-display font-black text-red-800 whitespace-nowrap">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setFormOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Tahrirlash</span>
                    </button>

                    <button
                      onClick={() => setDeletingProduct(product)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>O‘chirish</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </>
        )}
      </main>

      <ProductFormModal
        isOpen={formOpen}
        initialProduct={editingProduct}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveProduct}
      />

      <DeleteConfirmModal
        product={deletingProduct}
        deleting={isDeleting}
        onCancel={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
      />

      <AccountSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}