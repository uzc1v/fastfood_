import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/visitors', visitorRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({ message: err.message || 'Serverda xatolik yuz berdi.' });
});

await initDB();
app.listen(PORT, () => {
  console.log(`🔥 FLAMEBITES Backend server http://localhost:${PORT} da ishga tushdi`);
});