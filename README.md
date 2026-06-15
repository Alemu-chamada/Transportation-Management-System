<div align="center">

# 🚐 Transportation Management System

### *Revolutionizing Urban Mobility with Smart Technology*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14-blue)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/react-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.6.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)

---

### *A comprehensive, production-ready platform for managing transportation services with real-time tracking, secure bookings, and intelligent user management*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [production-ready](#-demo) • [Documentation](#-documentation)

---

</div>

## 🌟 Overview

The **Transportation Management System (TMS)** is a modern, full-stack web application designed to streamline transportation operations. Built with cutting-edge technologies, it provides a seamless experience for passengers, drivers, and administrators while maintaining enterprise-grade security and performance.

### ✨ What Makes TMS Special?

- 🔐 **Bank-Grade Security** - Email OTP authentication, JWT tokens, and encrypted passwords
- 📊 **Real-Time Analytics** - Live dashboard with system metrics for all users
- 🎯 **Role-Based Access** - Intelligent permission system for passengers, drivers, and admins
- 💳 **Secure Payments** - Integrated payment processing with webhook support
- 🗺️ **Live Tracking** - Real-time trip tracking via WebSocket technology
- 📱 **Responsive Design** - Beautiful UI that works seamlessly on all devices
- ⚡ **Lightning Fast** - Optimized with Redis caching and efficient database queries
- 🔔 **Smart Notifications** - Real-time updates for bookings, trips, and payments

---

## 🎯 Features

### 🚀 Core Functionality

<table>
<tr>
<td width="50%">

#### For Passengers 👥
- 🔍 **Smart Trip Discovery** - Find trips by route, time, and price
- 💺 **Interactive Seat Selection** - Visual seat picker with real-time availability
- 📱 **Booking Management** - View, modify, and track all bookings
- 💳 **Secure Payments** - Multiple payment options with instant confirmation
- 🗺️ **Live Tracking** - Track your trip in real-time on the map
- 🔔 **Instant Notifications** - Updates on booking status and trip changes
- 📊 **Personal Dashboard** - View statistics and travel history

</td>
<td width="50%">

#### For Admins 🛡️
- 👥 **User Management** - Complete control over user accounts and roles
- 🚗 **Trip Management** - Create, update, and monitor all trips
- 💰 **Revenue Analytics** - Real-time financial reports and insights
- 📊 **System Metrics** - Monitor performance and user activity
- 🔍 **Audit Logs** - Complete trail of all system actions
- ⚙️ **System Health** - Monitor database, Redis, and server status
- 📈 **Booking Analytics** - Track booking trends and patterns

</td>
</tr>
</table>

### 🎨 User Experience

- **Universal Dashboard** - All authenticated users get access to beautiful dashboards with real-time metrics
- **Smart Navigation** - Intuitive interface that adapts to your role
- **Dark Mode Ready** - Eye-friendly theme for day and night usage
- **Responsive Design** - Perfect experience on mobile, tablet, and desktop
- **Smooth Animations** - Delightful interactions powered by Framer Motion

---

## 🛠️ Tech Stack

### Backend Architecture

```
┌─────────────────────────────────────────────┐
│  Node.js + Express.js REST API              │
├─────────────────────────────────────────────┤
│  🔐 JWT Authentication                       │
│  📧 Email OTP (Nodemailer + Gmail)          │
│  🗄️ PostgreSQL Database                     │
│  ⚡ Redis Caching                           │
│  🔌 Socket.IO Real-time                     │
│  🔒 Bcrypt Password Hashing                 │
└─────────────────────────────────────────────┘
```

### Frontend Stack

```
┌─────────────────────────────────────────────┐
│  React 18 + TypeScript + Vite              │
├─────────────────────────────────────────────┤
│  🎨 Tailwind CSS                            │
│  🎭 Shadcn UI Components                    │
│  🎬 Framer Motion Animations                │
│  🧭 React Router Navigation                 │
│  📱 Responsive Design                       │
└─────────────────────────────────────────────┘
```

### DevOps & Tools

- **Docker** - Containerization for PostgreSQL and Redis
- **Nodemon** - Hot reload during development
- **ESLint** - Code quality and consistency
- **Git** - Version control with clean history

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v6 or higher) - [Download](https://redis.io/download)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Alemu-chamada/Transportation-Management-System.git
cd Transportation-Management-System
```

#### 2️⃣ Database Setup

```bash
# Create PostgreSQL database
createdb TMSDB

# Import the schema
psql -d TMSDB -f TMSDB.sql
```

#### 3️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your credentials
# Required: Database, Redis, JWT secrets, Email (Gmail)

# Start Redis (if not running)
redis-server

# Run the backend
npm run dev
```

**Backend runs on:** `http://localhost:5002`

#### 4️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Optional: Configure API URL
echo "VITE_API_URL=http://localhost:5002/api/v1" > .env

# Start the frontend
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## 🔐 Email Configuration

### Gmail Setup for OTP

1. **Enable 2-Factor Authentication** on your Gmail account
2. Navigate to: **Google Account** → **Security** → **2-Step Verification**
3. Generate an **App Password** for "Mail"
4. Add to `backend/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

🔒 **Security Note:** Never commit `.env` files. Use `.env.example` as a template.

---

## 📁 Project Structure

```
Transportation-Management-System/
│
├── 🗄️ backend/
│   ├── src/
│   │   ├── config/           # Environment configuration
│   │   ├── infrastructure/   # Database, Redis, Socket.IO
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # Authentication & OTP
│   │   │   ├── booking/      # Booking management
│   │   │   ├── trip/         # Trip operations
│   │   │   ├── payment/      # Payment processing
│   │   │   ├── user/         # User management
│   │   │   └── admin/        # Admin operations
│   │   ├── jobs/             # Background jobs
│   │   └── shared/           # Utilities & middleware
│   ├── .env.example          # Environment template
│   └── README.md             # Backend documentation
│
├── 🎨 frontend/
│   ├── src/
│   │   ├── features/         # Feature-based modules
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── Home.tsx      # Universal dashboard
│   │   │   └── ...
│   │   ├── providers/        # React Context
│   │   ├── routes/           # Routing configuration
│   │   ├── shared/           # Reusable components
│   │   └── styles/           # Global styles
│   └── vite.config.ts
│
├── 📊 TMSDB.sql              # Database schema
├── 📄 LICENSE                # MIT License
├── 🤝 CONTRIBUTING.md        # Contribution guidelines
└── 📖 README.md              # This file
```

---

## 🔌 API Endpoints

### Authentication & Authorization

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/register` | Register new user | ❌ |
| `POST` | `/api/v1/auth/login` | Login with credentials | ❌ |
| `POST` | `/api/v1/auth/verify-otp` | Verify OTP code | ❌ |
| `POST` | `/api/v1/auth/resend-otp` | Resend OTP | ❌ |
| `POST` | `/api/v1/auth/logout` | Logout user | ✅ |
| `GET` | `/api/v1/auth/me` | Get current user | ✅ |

### Trip Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/trips/scheduled` | Get scheduled trips | ✅ |
| `GET` | `/api/v1/trips/nearby` | Search trips by route | ✅ |
| `GET` | `/api/v1/trips/:id` | Get trip details | ✅ |
| `POST` | `/api/v1/trips` | Create new trip | ✅ Admin |
| `GET` | `/api/v1/trips/:id/occupied-seats` | Get occupied seats | ✅ |

### Booking Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/bookings/my` | Get user bookings | ✅ |
| `POST` | `/api/v1/bookings` | Create booking | ✅ |
| `PATCH` | `/api/v1/bookings/:id/cancel` | Cancel booking | ✅ |

### Admin Panel

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/admin/users` | List all users | ✅ Admin |
| `PATCH` | `/api/v1/admin/users/:id/role` | Update user role | ✅ Admin |
| `GET` | `/api/v1/admin/metrics` | System metrics | ✅ Admin |
| `GET` | `/api/v1/admin/audit-logs` | View audit logs | ✅ Admin |
| `GET` | `/api/v1/admin/health` | System health check | ✅ Admin |

---

## 👥 User Roles & Permissions

### 🎭 Role Matrix

| Feature | Passenger | Driver | Admin |
|---------|:---------:|:------:|:-----:|
| View Dashboard | ✅ | ✅ | ✅ |
| Book Trips | ✅ | ❌ | ✅ |
| Manage Own Bookings | ✅ | ❌ | ✅ |
| Track Trips | ✅ | ✅ | ✅ |
| Create Trips | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| View Audit Logs | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ✅ |



## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Email OTP Verification** - Two-factor authentication via email
- ✅ **Password Hashing** - Bcrypt with salt rounds
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Input Validation** - Server-side validation on all endpoints
- ✅ **SQL Injection Protection** - Parameterized queries
- ✅ **XSS Prevention** - Content sanitization
- ✅ **CORS Configuration** - Controlled cross-origin requests
- ✅ **Audit Logging** - Complete trail of all actions
- ✅ **Environment Variables** - Secrets management

---

## 📊 System Requirements

### Development

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | 2 cores | 4+ cores |
| **RAM** | 4 GB | 8 GB+ |
| **Storage** | 10 GB | 50 GB SSD |
| **Node.js** | v20.0.0 | Latest LTS |
| **PostgreSQL** | v14 | v15+ |
| **Redis** | v6 | v7+ |

### Production

| Component | Specification |
|-----------|---------------|
| **CPU** | 4+ cores |
| **RAM** | 16 GB+ |
| **Storage** | 100 GB+ SSD |
| **Database** | Managed PostgreSQL |
| **Cache** | Managed Redis |
| **SSL/TLS** | Required |

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT secrets
- [ ] Configure production database
- [ ] Set up managed Redis
- [ ] Configure email service
- [ ] Enable HTTPS/SSL
- [ ] Set up reverse proxy (Nginx)
- [ ] Configure CORS for production domain
- [ ] Set up automated backups
- [ ] Configure logging and monitoring
- [ ] Set up CI/CD pipeline

### Environment Variables

See `backend/.env.example` for all required configuration variables.

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### How to Contribute

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💻 Make your changes
4. ✅ Test thoroughly
5. 📝 Commit (`git commit -m 'Add AmazingFeature'`)
6. 🚀 Push (`git push origin feature/AmazingFeature`)
7. 🎉 Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Alemu Chamada**  
*Computer Science and Engineering*  
*Adama Science and Technology University (ASTU)*


## 📞 Support & Contact

- 📧 **Email:** alemuchamadda@gmail.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/Alemu-chamada/Transportation-Management-System/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Alemu-chamada/Transportation-Management-System/discussions)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ by Alemu Chamada**

[⬆ Back to Top](#-transportation-management-system)

</div>
