# Meetly

A full-stack web application for managing and participating in meetings — deployed at https://meetly-chi.vercel.app/

## 🧠 Overview

Meetly is a modern **React + Node.js + TypeORM** meeting platform that lets users:

- 🔹 Create, view, and manage meetings  
- 🔹 Join scheduled meetings  
- 🔹 Interact with a responsive, user-friendly interface  
- 🔹 Persist data via a backend API

The project includes:
- A **frontend** (React/Next.js/TypeScript)
- A **backend** (Node.js/Express/TypeScript)
- A **TypeORM** database (hosted via Supabase/other)
- Deployment via **Vercel** and **Render**

---

## 🚀 Live Demo

👉 https://meetly-chi.vercel.app/

---

## 📁 Features

✔️ User authentication and session management  
✔️ Meeting creation and scheduling  
✔️ Responsive, clean UI  
✔️ API backend with database persistence  
✔️ Fully deployed production app

---

## 🛠 Tech Stack

**Frontend**
- React (Next.js)  
- TypeScript  
- TailwindCSS (or CSS Modules)  
- Axios / Fetch

**Backend**
- Node.js  
- Express.js  
- TypeScript  
- TypeORM

**Database**
- Supabase / TypeORM

**Deployment**
- Frontend: Vercel  
- Backend: Render or similar cloud host

---

## 📦 Installation (Local Development)

1. **Clone the repo**
   ```bash
      git clone https://github.com/Sumedh-6504/Meetly.git
      cd Meetly

# in the root
      npm install

# in frontend
      cd frontend
      npm install

# in backend
      cd ../backend
      npm install

DB_HOST=<your_postgres_host>
DB_PORT=5432
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_NAME=<your_db_name>


# Start the Servers

# backend
      cd backend
      node dist/index.js

# frontend
      cd ../frontend
      npm run dev

# 📂Project Structure

      MEETLY/
      │
      ├── backend/
      │   ├── src/
      │   │   ├── @types/                  # Custom TypeScript declarations
      │   │   ├── config/
      │   │   │   ├── env.ts               # Environment variable loader
      │   │   │   ├── google.ts            # Google OAuth2 & Calendar config
      │   │   │   └── database.ts          # PostgreSQL connection
      │   │   │
      │   │   ├── controllers/
      │   │   │   ├── auth.controller.ts   # Google OAuth callbacks
      │   │   │   └── meeting.controller.ts
      │   │   │
      │   │   ├── databases/
      │   │   │   └── postgres.ts          # DB pool & queries
      │   │   │
      │   │   ├── enums/                   # Enums (roles, status, scopes)
      │   │   │
      │   │   ├── middlewares/
      │   │   │   ├── auth.middleware.ts   # JWT & OAuth verification
      │   │   │   └── error.middleware.ts
      │   │   │
      │   │   ├── routes/
      │   │   │   ├── auth.routes.ts       # /auth/google
      │   │   │   └── meeting.routes.ts    # /meetings
      │   │   │
      │   │   ├── services/
      │   │   │   ├── auth.service.ts      # OAuth logic
      │   │   │   ├── google.service.ts    # Google Calendar API calls
      │   │   │   └── meeting.service.ts   # Business logic
      │   │   │
      │   │   ├── utils/
      │   │   │   ├── jwt.ts               # Token helpers
      │   │   │   ├── logger.ts
      │   │   │   └── validators.ts
      │   │   │
      │   │   └── index.ts                 # Server entry point
      │   │
      │   ├── dist/                        # Compiled JS
      │   ├── .env
      │   ├── package.json
      │   └── tsconfig.json
      │
      ├── frontend/
      │   ├── src/
      │   │   ├── assets/
      │   │   ├── components/
      │   │   │   ├── auth/                # Google Sign-In components
      │   │   │   └── meeting/
      │   │   │
      │   │   ├── context/
      │   │   │   └── AuthContext.tsx      # User & token state
      │   │   │
      │   │   ├── hooks/
      │   │   │   ├── useAuth.ts
      │   │   │   └── useMeetings.ts
      │   │   │
      │   │   ├── lib/
      │   │   │   ├── api.ts               # Axios / Fetch wrapper
      │   │   │   └── google.ts            # Google OAuth helpers
      │   │   │
      │   │   ├── pages/
      │   │   │   ├── Login.tsx
      │   │   │   ├── Dashboard.tsx
      │   │   │   └── Calendar.tsx
      │   │   │
      │   │   ├── routes/
      │   │   │   └── AppRoutes.tsx
      │   │   │
      │   │   ├── store/
      │   │   │   └── meeting.store.ts
      │   │   │
      │   │   ├── types/
      │   │   │   └── index.ts
      │   │   │
      │   │   ├── App.tsx
      │   │   └── main.tsx
      │   │
      │   ├── .env
      │   ├── vite.config.ts
      │   └── tailwind.config.js
      │
      └── README.md

# 🔵HIGH LEVEL ARCHITECTURE

      User
       ↓
      Frontend (React + Vite)
       ↓  HTTPS (JWT / OAuth Token)
      Backend (Node.js + Express)
       ↓
      TypeORM (Supabase)
       ↓
      Google APIs (OAuth2 & Calendar)

## 🙌 Conclusion

*Meetly* is a full-stack project built to explore real-world application development, authentication flows, third-party API integrations, and cloud deployment.  
It demonstrates a scalable architecture, clean separation of concerns, and practical use of modern web technologies.

The project can be extended further with features like notifications, video conferencing integrations, and advanced scheduling capabilities.
