import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Hotdog', 'Lavash', 'Burger'];

export default function ProductFormModal({ isOpen, initialProduct, onClose, onSave }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Burger');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initialProduct);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (initialProduct) {
        setName(initialProduct.name);
        setPrice(String(initialProduct.price));
        setCategory(initialProduct.category);
        setDescription(initialProduct.description);
        setPreviewUrl(initialProduct.image);
        setImageFile(null);
      } else {
        setName('');
        setPrice('');
        setCategory('Burger');
        setDescription('');
        setPreviewUrl('');
        setImageFile(null);
      }
    }
  }, [isOpen, initialProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Iltimos, faqat rasm faylini tanlang.');
      return;
    }
    setError('');
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !price || !category || !description.trim()) {
      setError("Barcha majburiy maydonlarni to'ldiring.");
      return;
    }
    if (Number(price) <= 0) {
      setError("Narx 0 dan katta bo'lishi kerak.");
      return;
    }
    if (!isEdit && !imageFile) {
      setError('Mahsulot rasmini yuklash majburiy.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description.trim());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    setSaving(true);
    try {
      await onSave(formData, initialProduct?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Saqlashda xatolik yuz berdi.');
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
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 18 }}
            className="relative z-10 bg-white w-full max-w-xl rounded-[2rem] shadow-2xl border border-amber-200 overflow-hidden my-8"
          >
            <div className="px-6 py-5 bg-red-900 text-white flex items-center justify-between">
              <h2 className="font-display text-xl font-black text-amber-300">
                {isEdit ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-red-800 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Mahsulot rasmi {!isEdit && <span className="text-red-600">*</span>}
                </label>
                <label className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 transition-colors cursor-pointer overflow-hidden relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-neutral-500 p-4 text-center">
                      <UploadCloud className="w-9 h-9 text-red-800 mb-2" />
                      <span className="text-sm font-bold text-neutral-800">
                        Kompyuterdan rasm yuklang
                      </span>
                      <span className="text-xs text-neutral-400 mt-0.5">
                        JPG, PNG, WEBP (maks. 5MB)
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Mahsulot nomi <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Double Cheeseburger"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:bg-white focus:outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Narxi (so‘m) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="38000"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:bg-white focus:outline-none text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Kategoriyasi <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-2.5 rounded-xl text-sm font-extrabold border transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-red-800 text-amber-300 border-red-800 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-amber-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Mahsulot haqida batafsil ma’lumot <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tarkibi, vazni va o'ziga xos ta'mi haqida yozing..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-red-800 focus:bg-white focus:outline-none text-sm"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-800 hover:bg-red-900 disabled:opacity-60 text-amber-300 text-sm font-extrabold shadow-md cursor-pointer"
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