# 🇧🇩 People E-Sheba — Super Citizen Platform

A production-level, full-stack, AI-powered citizen services platform for Bangladesh.

## 📁 Project Structure
```
pesheba/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   layout, ui, admin
│   │   ├── pages/        auth, admin, public pages
│   │   ├── context/      Auth + Language context
│   │   ├── services/     Axios API client
│   │   └── translations/ en.json + bn.json
│   └── package.json
└── backend/           # Node.js + Express + MySQL
    ├── src/
    │   ├── controllers/  auth, user, emergency, blood, donation, job, volunteer, admin
    │   ├── routes/       index.js (all routes)
    │   ├── middleware/   auth, upload, errorHandler
    │   ├── config/       db.js (MySQL pool)
    │   └── utils/        jwt.js, response.js
    ├── database/
    │   └── schema.sql    (complete MySQL schema + seed)
    └── package.json
```

## 🚀 Setup

### 1. Database
```bash
mysql -u root -p < backend/database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env      # edit with your DB credentials
npm install
npm run dev               # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## 🔑 Default Admin
- **Email:** admin@esheba.bd
- **Password:** Admin@1234
- **Route:** /admin

## ✨ Features
- 🔐 JWT Authentication + Role-based access (user/admin)
- 🌐 Bilingual: English ↔ Bangla toggle
- 🚨 Emergency services with SOS modal (999, 199, etc.)
- 🩸 Blood donor registry with availability toggle
- ❤️  Donation/help request system with progress tracking
- 💼 Job portal with applications + resume upload
- 🙌 Volunteer network registration
- 🤖 AI Chatbot assistant (NLP keyword routing)
- 📊 Full Admin Dashboard with Recharts analytics
- 👥 User management (block/unblock/delete/role change)
- 📢 Broadcast notifications to all users
- 🗺️  Map page (plug in Google Maps API key)
- 📱 Mobile-first responsive design
- 🌓 Dark theme throughout

## 🗺️ API Endpoints
| Method | Route | Auth |
|--------|-------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET  | /api/auth/me | Protected |
| GET  | /api/emergency | Public |
| GET  | /api/blood-donors | Public |
| GET  | /api/donations | Public |
| GET  | /api/jobs | Public |
| GET  | /api/volunteers | Public |
| GET  | /api/admin/dashboard | Admin |
| ... | ... | ... |
md jumman 