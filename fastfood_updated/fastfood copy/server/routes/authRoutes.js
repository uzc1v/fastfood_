import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDB, writeDB } from '../utils/db.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Login va parol kiritilishi shart.' });
  }

  const db = readDB();
  const isUsernameValid = username.trim() === db.admin.username;
  const isPasswordValid = await bcrypt.compare(password, db.admin.passwordHash);

  if (!isUsernameValid || !isPasswordValid) {
    return res.status(401).json({ message: "Login yoki parol noto'g'ri!" });
  }

  const token = jwt.sign(
    { id: db.admin.id, username: db.admin.username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
  );

  res.json({
    token,
    admin: { username: db.admin.username },
  });
});

router.get('/me', verifyAdmin, (_req, res) => {
  const db = readDB();
  res.json({ admin: { username: db.admin.username } });
});

router.put('/credentials', verifyAdmin, async (req, res) => {
  const { currentUsername, newUsername, currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentUsername || !newUsername || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Barcha maydonlarni to'ldiring." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Yangi parol va tasdiqlash paroli mos kelmadi.' });
  }

  const db = readDB();
  if (currentUsername.trim() !== db.admin.username) {
    return res.status(400).json({ message: "Hozirgi login noto'g'ri kiritildi." });
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, db.admin.passwordHash);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Hozirgi parol noto'g'ri." });
  }

  db.admin.username = newUsername.trim();
  db.admin.passwordHash = await bcrypt.hash(newPassword, 12);
  db.admin.updatedAt = new Date().toISOString();
  writeDB(db);

  const token = jwt.sign(
    { id: db.admin.id, username: db.admin.username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
  );

  res.json({
    message: "Admin login va paroli muvaffaqiyatli yangilandi!",
    token,
    admin: { username: db.admin.username },
  });
});

export default router;