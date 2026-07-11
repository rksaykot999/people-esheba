const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const mkdirp = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

// Vercel serverless environment এর জন্য memory storage, অন্যথায় disk storage
const isVercel = process.env.VERCEL === '1';

const storage = (subDir) =>
  isVercel
    ? multer.memoryStorage() // Vercel এ memory storage ব্যবহার করবে
    : multer.diskStorage({
        destination: (req, file, cb) => {
          const dest = path.join(__dirname, '../../uploads', subDir);
          mkdirp(dest);
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const ext  = path.extname(file.originalname).toLowerCase();
          const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
          cb(null, name);
        },
      });

const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext     = path.extname(file.originalname).toLowerCase();
  cb(allowed.includes(ext) ? null : new Error('Only images allowed'), allowed.includes(ext));
};

const resumeFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext     = path.extname(file.originalname).toLowerCase();
  cb(allowed.includes(ext) ? null : new Error('Only PDF/DOC allowed'), allowed.includes(ext));
};

const MAX = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

exports.uploadAvatar   = multer({ storage: storage('avatars'),   fileFilter: imageFilter,  limits: { fileSize: MAX } }).single('avatar');
exports.uploadDonation = multer({ storage: storage('donations'), fileFilter: imageFilter,  limits: { fileSize: MAX } }).single('image');
exports.uploadResume   = multer({ storage: storage('resumes'),   fileFilter: resumeFilter, limits: { fileSize: MAX } }).single('resume');
