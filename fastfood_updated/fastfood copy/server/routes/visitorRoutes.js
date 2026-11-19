import express from 'express';
import crypto from 'crypto';
import { readDB, writeDB } from '../utils/db.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { validateVisitor } from '../utils/visitorValidation.js';

const router = express.Router();

// Oddiy suiiste'moldan himoya: bir IP dan daqiqasiga 20 tagacha so'rov.
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const recent = (hits.get(key) || []).filter((t) => now - t < 60_000);
  if (recent.length >= 20) {
    return res.status(429).json({ message: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." });
  }
  recent.push(now);
  hits.set(key, recent);
  next();
}

// Mijoz saytga kirganda ma'lumotini yuboradi (ochiq endpoint).
router.post('/', rateLimit, (req, res) => {
  const result = validateVisitor(req.body);
  if (!result.ok) return res.status(400).json({ message: result.message });

  const { firstName, lastName, phone } = result.value;
  const now = new Date().toISOString();
  const db = readDB();
  db.visitors = db.visitors || [];

  // Bir xil telefon raqami qayta kirsa — yangi qator emas, mavjudini yangilaymiz.
  let visitor = db.visitors.find((v) => v.phone === phone);
  if (visitor) {
    visitor.firstName = firstName;
    visitor.lastName = lastName;
    visitor.lastVisitAt = now;
    visitor.visitCount = (visitor.visitCount || 1) + 1;
  } else {
    visitor = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      phone,
      visitCount: 1,
      createdAt: now,
      lastVisitAt: now,
    };
    db.visitors.unshift(visitor);
  }
  writeDB(db);

  res.status(201).json({
    visitor: { id: visitor.id, firstName: visitor.firstName, lastName: visitor.lastName, phone: visitor.phone },
  });
});

// Admin: mijozlar ro'yxati.
router.get('/', verifyAdmin, (_req, res) => {
  const db = readDB();
  const visitors = [...(db.visitors || [])].sort(
    (a, b) => new Date(b.lastVisitAt) - new Date(a.lastVisitAt)
  );
  res.json(visitors);
});

// Admin: mijozni o'chirish.
router.delete('/:id', verifyAdmin, (req, res) => {
  const db = readDB();
  const before = (db.visitors || []).length;
  db.visitors = (db.visitors || []).filter((v) => v.id !== req.params.id);
  if (db.visitors.length === before) {
    return res.status(404).json({ message: 'Mijoz topilmadi.' });
  }
  writeDB(db);
  res.json({ message: "Mijoz o'chirildi.", id: req.params.id });
});

export default router;
