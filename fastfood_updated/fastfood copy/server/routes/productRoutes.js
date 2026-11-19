import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDB, writeDB } from '../utils/db.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { uploadProductImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VALID_CATEGORIES = ['Hotdog', 'Lavash', 'Burger'];

function deleteLocalFile(imageUrl) {
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

router.get('/', (req, res) => {
  const { category } = req.query;
  const db = readDB();
  let products = [...db.products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (category && category !== 'Barchasi') {
    products = products.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(products);
});

router.post('/', verifyAdmin, uploadProductImage.single('image'), (req, res) => {
  const { name, price, category, description } = req.body;

  if (!name?.trim() || !price || !category || !description?.trim()) {
    if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
    return res.status(400).json({ message: "Barcha majburiy maydonlarni to'ldiring." });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
    return res.status(400).json({ message: "Noto'g'ri kategoriya tanlandi." });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Mahsulot rasmini yuklash majburiy.' });
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    deleteLocalFile(`/uploads/${req.file.filename}`);
    return res.status(400).json({ message: "Narx musbat raqam bo'lishi kerak." });
  }

  const now = new Date().toISOString();
  const newProduct = {
    id: crypto.randomUUID(),
    name: name.trim(),
    price: numericPrice,
    category,
    image: `/uploads/${req.file.filename}`,
    description: description.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const db = readDB();
  db.products.unshift(newProduct);
  writeDB(db);

  res.status(201).json(newProduct);
});

router.put('/:id', verifyAdmin, uploadProductImage.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, price, category, description } = req.body;

  const db = readDB();
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) {
    if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
    return res.status(404).json({ message: 'Mahsulot topilmadi.' });
  }

  if (!name?.trim() || !price || !category || !description?.trim()) {
    if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
    return res.status(400).json({ message: "Barcha majburiy maydonlarni to'ldiring." });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
    return res.status(400).json({ message: "Noto'g'ri kategoriya." });
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
    return res.status(400).json({ message: "Narx musbat raqam bo'lishi kerak." });
  }

  const existing = db.products[index];
  let imagePath = existing.image;

  if (req.file) {
    deleteLocalFile(existing.image);
    imagePath = `/uploads/${req.file.filename}`;
  }

  const updatedProduct = {
    ...existing,
    name: name.trim(),
    price: numericPrice,
    category,
    image: imagePath,
    description: description.trim(),
    updatedAt: new Date().toISOString(),
  };

  db.products[index] = updatedProduct;
  writeDB(db);

  res.json(updatedProduct);
});

router.delete('/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Mahsulot topilmadi.' });
  }

  const [removed] = db.products.splice(index, 1);
  deleteLocalFile(removed.image);
  writeDB(db);

  res.json({ message: "Mahsulot muvaffaqiyatli o'chirildi.", id });
});

export default router;