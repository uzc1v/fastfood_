import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const SEED_PRODUCTS = [
  {
    id: crypto.randomUUID(),
    name: 'Royal Double Cheeseburger',
    price: 42000,
    category: 'Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    description: "Ikki qavatli 100% mol go'shtidan tayyorlangan kotlet, eritilgan chedder pishlog'i, karamellangan piyoz, tuzlangan bodring va maxsus tutunli FLAME sousi.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Tandir Mol Go‘shtli Lavash',
    price: 36000,
    category: 'Lavash',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80',
    description: "Yupqa qarsildoq lavash xamiri ichida shirali mol go'shti bo'laklari, yangi pomidor, bodring, qarsildoq kartoshka fri va sarimsoqli qaymoqli sous.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Smoky BBQ King Hotdog',
    price: 28000,
    category: 'Hotdog',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=900&q=80',
    description: "Yumshoq brioche bulochkada dudlangan mol go'shti sosiskasi, qovurilgan piyoz halqalari, xantal, BBQ sousi va eritilgan pishloq.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Spicy Jalapeño Fire Burger',
    price: 45000,
    category: 'Burger',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80',
    description: "Achchiq ta'm shinavandalari uchun: olovda pishgan go'sht, jalapeño qalampiri, pepper jack pishlog'i va maxsus achchiq chili mayonez.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Pishloqli Tovuqli Lavash',
    price: 33000,
    category: 'Lavash',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80',
    description: "Maxsus ziravorlarda marinadlangan tovuq filesi, ikki xil eritilgan pishloq, yangi sabzavotlar va firmenniy sous.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Double Cheese Chili Hotdog',
    price: 31000,
    category: 'Hotdog',
    image: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=900&q=80',
    description: "Ikki barobar pishloqli sous, mol go'shtli qiyma chili, yangi ko'katlar va qarsildoq piyoz bilan boyitilgan premium hotdog.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const initialData = {
      admin: {
        id: 'admin-1',
        username: 'admin',
        passwordHash: hashedPassword,
        updatedAt: new Date().toISOString(),
      },
      products: SEED_PRODUCTS,
      visitors: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function readDB() {
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function writeDB(data) {
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}