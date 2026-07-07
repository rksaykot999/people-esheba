require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Vercel বা অন্য কোনো রিভার্স প্রক্সির পেছনে থাকার কারণে ট্রাস্ট প্রক্সি অন করা হলো
app.set('trust proxy', 1);

// ── Security ──────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile, curl, etc.) and all localhost/dev origins
    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'https://people-esheba.vercel.app',
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now — restrict in production later
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiting ─────────────────────────────────────────────
const isDev = process.env.NODE_ENV !== 'production';

app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 200 : 20,    // Relaxed in dev
  message: { success: false, message: 'Too many requests, please try again later.' },
  skip: (req) => isDev && req.ip === '::1', // Skip localhost in dev
  validate: { trustProxy: false }, // Vercel ক্র্যাশ এড়ানোর জন্য ভ্যালিডেশন ফ্ল্যাগ
}));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 2000 : 300,
  skip: (req) => isDev && req.ip === '::1',
  validate: { trustProxy: false },
}));

// ── Body Parsing ──────────────────────────────────────────────
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// ── Logging ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Static Uploads ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'People E-Sheba API is running 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api', routes);

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
// শুধু লোকাল ডেভেলপমেন্ট এনভায়রনমেন্টে সার্ভার লিসেন করবে, Vercel প্রোডাকশনে নয়
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 People E-Sheba API`);
    console.log(`   → http://localhost:${PORT}`);
    console.log(`   → Health: http://localhost:${PORT}/health`);
    console.log(`   → ENV: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

// Vercel সার্ভারলেস ফাংশনের জন্য এক্সপ্রেস অ্যাপটি এক্সপোর্ট করা হলো
module.exports = app;