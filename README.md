<div align="center">

<br/>

<img src="https://img.shields.io/badge/🚌-Smart_Transport-FF4103?style=for-the-badge&labelColor=001621" alt="Smart Transport"/>

# Smart Transportation Management System

### *Digitalising public & private transportation — end to end.*

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-smart--transport.cyan.vercel.app-FF4103?style=flat-square&logo=vercel&logoColor=white)](https://smart-transport.cyan.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-Railway-7B2FBE?style=flat-square&logo=railway&logoColor=white)](https://smarttransport-production.up.railway.app/api/v1/health)
[![Database](https://img.shields.io/badge/🗄️%20Database-Neon%20PostgreSQL-00E699?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![License](https://img.shields.io/badge/📄%20License-MIT-22c55e?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/Node.js-v20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

<br/>

```
  🚌  ──────────────────────────────────────────────────────►  ✅
 Book        Search       Select       Pay        Track       Arrive
  Trip        Route        Seat      Securely    Live GPS    On Time
```

<br/>

</div>

---

## 📖 What is SmartTransport?

**SmartTransport** is a production-ready, full-stack web application that brings the entire transportation lifecycle into one unified platform. Whether you're a passenger booking a seat, a driver sharing your live location, or a system administrator managing an entire fleet — SmartTransport has a precisely tailored experience for you.

Built as a final-year Computer Science & Engineering project at **Addis Ababa Science and Technology University (ASTU)**, it demonstrates enterprise-grade engineering across the full stack: secure authentication, role-based access control, real-time communication, cloud deployment, and professional UI design.

> **Live at:** [smart-transport.cyan.vercel.app](https://smart-transport.cyan.vercel.app)

---

## ✨ Feature Highlights

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- Email OTP on every login (Gmail SMTP)
- Bcrypt password hashing (factor 12)
- JWT access + refresh token sessions
- Account lockout after 5 failed attempts
- Rate limiting on all sensitive endpoints

### 🎫 Trip Booking
- Browse admin-created scheduled trips
- Interactive seat selection map
- 15-minute reservation hold with Redis
- Real-time seat availability
- Booking state machine (reserved → confirmed → failed)

### 💳 Payment Processing
- Payment session creation
- Webhook-verified confirmation
- Full payment audit trail
- Automatic seat release on failure

</td>
<td width="50%">

### 📍 Live Vehicle Tracking
- Socket.IO real-time GPS streaming
- Driver location updates
- Passenger subscription to trip rooms
- REST fallback endpoint

### 👥 Role-Based Access Control
- Six roles with server + client enforcement
- Admin promotes users after verification
- Protected routes across all layers
- Profile completion workflow per role

### 📊 Admin Dashboard
- User management & role assignment
- Trip creation and scheduling
- Bus & driver fleet management
- System health monitoring
- Complete audit log trail

</td>
</tr>
</table>

---

## 👤 User Roles

```
                         ┌──────────────────┐
                         │  system_admin    │  ← Full platform access
                         └────────┬─────────┘
          ┌──────────────────────┼──────────────────────┐
   ┌──────┴──────┐     ┌─────────┴──────┐     ┌────────┴───────────────┐
   │   driver    │     │   traffic_     │     │  garage_manager /      │
   │             │     │   authority    │     │  fuel_station_manager  │
   └──────┬──────┘     └─────────┬──────┘     └────────┬───────────────┘
          └──────────────────────┼──────────────────────┘
                         ┌───────┴──────┐
                         │  passenger   │  ← Default on registration
                         └──────────────┘
```

| Role | Access Level | Description |
|---|:---:|---|
| 🧑‍✈️ `passenger` | Basic | Books trips, pays, tracks journeys, reads community posts |
| 🚌 `driver` | Elevated | Streams live GPS location, views assigned trips |
| 🚦 `traffic_authority` | Elevated | Publishes traffic announcements and posts |
| 🔧 `garage_manager` | Elevated | Manages garage service listings |
| ⛽ `fuel_station_manager` | Elevated | Manages fuel station locations and info |
| 👑 `system_admin` | Full | Complete platform control, user management, analytics |

---

## 🛠️ Tech Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td><strong>Frontend</strong></td>
<td>React 18 + TypeScript + Vite</td>
<td>SPA with type-safe components</td>
</tr>
<tr>
<td></td>
<td>Tailwind CSS + Shadcn UI</td>
<td>Design system & component library</td>
</tr>
<tr>
<td></td>
<td>Framer Motion</td>
<td>Smooth animations & transitions</td>
</tr>
<tr>
<td></td>
<td>React Router v7</td>
<td>Client-side routing & protected routes</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Node.js + Express.js</td>
<td>REST API server</td>
</tr>
<tr>
<td></td>
<td>Socket.IO</td>
<td>Real-time GPS tracking</td>
</tr>
<tr>
<td></td>
<td>Nodemailer + Gmail SMTP</td>
<td>Email OTP delivery</td>
</tr>
<tr>
<td></td>
<td>JWT + Bcrypt</td>
<td>Authentication & password security</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>PostgreSQL (Neon)</td>
<td>Primary relational database</td>
</tr>
<tr>
<td></td>
<td>Redis (Upstash)</td>
<td>Seat locking & session caching</td>
</tr>
<tr>
<td><strong>DevOps</strong></td>
<td>Railway</td>
<td>Backend deployment & hosting</td>
</tr>
<tr>
<td></td>
<td>Vercel</td>
<td>Frontend deployment & CDN</td>
</tr>
<tr>
<td></td>
<td>Neon</td>
<td>Serverless PostgreSQL</td>
</tr>
<tr>
<td></td>
<td>Upstash</td>
<td>Serverless Redis</td>
</tr>
</table>

---

## 🗂️ Project Structure

```
smartTransport/
│
├── 🎨 frontend/                    React + TypeScript SPA
│   └── src/
│       ├── features/               Feature modules (auth, trip, booking, payment…)
│       ├── pages/                  Route-level page components
│       │   ├── LandingPage.tsx     Public marketing page
│       │   ├── Home.tsx            Authenticated dashboard
│       │   ├── Trip.tsx            Find Trip + Track Trip
│       │   ├── TripDiscovery.tsx   Trip search & booking browse
│       │   ├── ContactPage.tsx     Contact with metro connector
│       │   └── admin/             Admin-only management pages
│       ├── providers/              AuthProvider — global auth state
│       ├── routes/                 MainLayout, Navbar, ProtectedRoute
│       └── shared/                 Reusable UI components & API service
│
├── ⚙️  backend/                    Node.js + Express REST API
│   └── src/
│       ├── modules/                Feature modules
│       │   ├── auth/               OTP, JWT, login, register, resend
│       │   ├── booking/            Seat reservation state machine
│       │   ├── trip/               Trip CRUD & seat management
│       │   ├── payment/            Payment sessions & webhooks
│       │   ├── tracking/           Live GPS via Socket.IO
│       │   ├── notification/       Event-driven notification delivery
│       │   ├── admin/              Metrics, user management, audit logs
│       │   ├── user/               Profile & account management
│       │   └── audit/              Append-only action logging
│       ├── infrastructure/         DB (Neon), Redis (Upstash), Socket.IO
│       ├── shared/                 Middleware, utilities, email service
│       └── jobs/                   Booking expiry & payment retry jobs
│
├── 🚀 deployment/                  Production configuration templates
│   ├── neon-database-setup.sql     Fix Neon ownership post-migration
│   ├── database-validation.sql     Production readiness checks
│   └── DEPLOYMENT_GUIDE.md        Step-by-step deploy guide
│
├── 🗄️  TMSDB.sql                   Full PostgreSQL schema v3.1
└── 📖  README.md                   This file
```

---

## 🚀 Getting Started Locally

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | v20+ | [nodejs.org](https://nodejs.org) |
| PostgreSQL | v14+ | [postgresql.org](https://www.postgresql.org) |
| Redis | v6+ | [redis.io](https://redis.io) |
| Git | Latest | [git-scm.com](https://git-scm.com) |

### 1. Clone the repository

```bash
git clone https://github.com/Alemu-chamada/smartTransport.git
cd smartTransport
```

### 2. Set up the database

```bash
# Create local PostgreSQL database
createdb TMSDB

# Import schema (tables, enums, triggers, functions, views)
psql -d TMSDB -f TMSDB.sql
```

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env with your local credentials
```

**Minimum `.env` for local development:**
```env
NODE_ENV=development
PORT=5002
PGHOST=localhost
PGPORT=5432
PGDATABASE=TMSDB
PGUSER=postgres
PGPASSWORD=your_password
REDIS_URL=redis://localhost:6379
JWT_SECRET=any_long_random_string_here
JWT_REFRESH_SECRET=another_long_random_string
SESSION_SECRET=yet_another_random_string
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

### 4. Start the backend

```bash
cd backend
npm install
npm run dev
# ✅ API running at http://localhost:5002
```

### 5. Start the frontend

```bash
cd frontend
npm install
# Create frontend/.env
echo "VITE_API_URL=http://localhost:5002/api/v1" > .env
npm run dev
# ✅ App running at http://localhost:5173
```

---

## ☁️ Deployment Architecture

```
┌──────────────────────┐          ┌────────────────────────┐
│  Vercel (Frontend)   │  HTTPS   │  Railway (Backend API) │
│  smart-transport.    │─────────►│  smarttransport-       │
│  cyan.vercel.app     │          │  production.up.        │
└──────────────────────┘          │  railway.app           │
                                  └──────────┬─────────────┘
                                             │
                         ┌───────────────────┼──────────────────┐
                         │                   │                  │
                  ┌──────▼──────┐   ┌────────▼──────┐  ┌───────▼──────┐
                  │    Neon     │   │   Upstash     │  │    Gmail     │
                  │ PostgreSQL  │   │    Redis      │  │  OTP Emails  │
                  │  Database   │   │   Caching     │  │              │
                  └─────────────┘   └───────────────┘  └──────────────┘
```

| Service | Platform | URL |
|---|---|---|
| 🎨 Frontend | [Vercel](https://vercel.com) | [smart-transport.cyan.vercel.app](https://smart-transport.cyan.vercel.app) |
| ⚙️ Backend API | [Railway](https://railway.app) | [smarttransport-production.up.railway.app](https://smarttransport-production.up.railway.app) |
| 🗄️ Database | [Neon](https://neon.tech) | Serverless PostgreSQL with SSL |
| 🔴 Cache | [Upstash](https://upstash.com) | Serverless Redis (TLS) |
| 📧 Email OTP | Gmail SMTP | Nodemailer with App Password |

---

## 📡 API Reference

**Base URL:** `https://smarttransport-production.up.railway.app/api/v1`

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `POST` | `/auth/register` | Register with email + password | ❌ |
| `POST` | `/auth/login` | Login — sends OTP to email | ❌ |
| `POST` | `/auth/verify-otp` | Verify OTP to complete login | ❌ |
| `POST` | `/auth/resend-otp` | Resend OTP code | ❌ |
| `POST` | `/auth/logout` | Logout and invalidate session | ✅ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

### Trips
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/trips/scheduled` | List all admin-created trips | ✅ |
| `GET` | `/trips/nearby` | Search trips by route | ✅ |
| `GET` | `/trips/:id` | Get trip details | ✅ |
| `POST` | `/trips` | Create trip | ✅ Admin |

### Bookings
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/bookings/my` | Get user's bookings | ✅ |
| `POST` | `/bookings` | Reserve a seat | ✅ |
| `PATCH` | `/bookings/:id/cancel` | Cancel booking | ✅ |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/admin/users` | List all users | ✅ Admin |
| `PATCH` | `/admin/users/:id/role` | Update user role | ✅ Admin |
| `GET` | `/admin/metrics` | System metrics | ✅ Admin |
| `GET` | `/admin/audit-logs` | Audit trail | ✅ Admin |
| `GET` | `/admin/health` | System health check | ✅ Admin |

---

## 🔒 Security Highlights

```
✅ JWT stateless authentication — no server-side sessions
✅ Email OTP on every login — Gmail SMTP via Nodemailer
✅ Bcrypt password hashing — work factor 12
✅ Account lockout after 5 failed login attempts
✅ Role-based access — enforced on both server and client
✅ Rate limiting — protects auth, booking, and payment endpoints
✅ Helmet.js HTTP security headers
✅ CORS — strict origin allowlist including *.vercel.app
✅ Parameterised SQL queries — zero injection risk
✅ Immutable audit log — append-only record of all actions
✅ Redis seat locking — prevents double-booking race conditions
✅ OTP never logged — only sent to user's email
```

---

## 🗄️ Database Schema

The full PostgreSQL schema is in `TMSDB.sql` (v3.1). Key tables and their roles:

| Table | Purpose |
|---|---|
| `users` | Accounts, roles, lockout tracking, timestamps |
| `otp_codes` | Permanent OTP audit trail (hashed) |
| `trips` | Full lifecycle with status machine |
| `seats` | Per-trip seat inventory |
| `bookings` | State machine: reserved → payment_pending → confirmed |
| `payments` | Payment records with webhook verification |
| `buses` | Fleet registry |
| `role_profiles` | Per-role profile completion data |
| `notifications` | Event-driven notification delivery tracking |
| `posts` / `comments` | Community feed with nested replies |
| `services` | Garage and fuel station locations |
| `audit_logs` | Immutable action audit trail |
| `bus_locations` | Real-time GPS location history |

---

## 🤝 Contributing

Contributions are welcome! Please read the guidelines before submitting a PR.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with conventional messages: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

---

## 👨‍💻 Author

<div align="center">

**Alemu Chamada**
*Computer Science & Engineering · ASTU*

[![Email](https://img.shields.io/badge/📧-alemuchamada@gmail.com-FF4103?style=flat-square)](mailto:alemuchamada@gmail.com)
[![GitHub](https://img.shields.io/badge/🐙-Alemu--chamada-181717?style=flat-square&logo=github)](https://github.com/Alemu-chamada)
[![LinkedIn](https://img.shields.io/badge/💼-Alemu%20Chamada-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/alemu-chamada)
[![Phone](https://img.shields.io/badge/📞-+251%2095%20604%207594-001621?style=flat-square)](tel:+251956047594)

*System contact: [smarttransportserv@gmail.com](mailto:smarttransportserv@gmail.com)*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

**🚌 Connecting people. Simplifying journeys. Building smarter transportation every day.**

*Made with ❤️ by Alemu Chamada · ASTU · 2026*

⭐ **Star this repo if you found it helpful!**

</div>
