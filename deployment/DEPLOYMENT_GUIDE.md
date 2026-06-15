# 🚀 Complete Deployment Guide
## Transportation Management System

---

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [A. Database Migration (Neon)](#a-database-migration-neon)
- [B. Backend Deployment (Render)](#b-backend-deployment-render)
- [C. Frontend Deployment (Vercel)](#c-frontend-deployment-vercel)
- [D. Redis Setup (Upstash)](#d-redis-setup-upstash)
- [E. Environment Variables](#e-environment-variables)
- [F. Post-Deployment Verification](#f-post-deployment-verification)
- [G. Production Checklist](#g-production-checklist)

---

## Prerequisites

### Required Accounts
- ✅ [Neon](https://neon.tech) - PostgreSQL Database
- ✅ [Render](https://render.com) or [Railway](https://railway.app) - Backend Hosting
- ✅ [Vercel](https://vercel.com) - Frontend Hosting
- ✅ [Upstash](https://upstash.com) - Redis Database
- ✅ [GitHub](https://github.com) - Code Repository
- ✅ Gmail Account - Email OTP service

### Tools Needed
- Git
- Node.js v20+
- PostgreSQL client (psql)
- Text editor

---

## A. Database Migration (Neon)

### Step 1: Create Neon Project

1. Go to [Neon Console](https://console.neon.tech)
2. Click "New Project"
3. **Project Name:** `tms-production`
4. **Region:** Choose closest to your users
5. **PostgreSQL Version:** 16
6. Click "Create Project"

### Step 2: Get Connection String

From Neon dashboard, copy the connection string:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

Example:
```
postgresql://neondb_owner:xxxxx@ep-cool-darkness-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Run Migration Scripts

```bash
# Navigate to deployment folder
cd deployment

# Run setup script
psql "postgresql://[your-neon-connection-string]" -f neon-database-setup.sql

# Run validation
psql "postgresql://[your-neon-connection-string]" -f database-validation.sql
```

### Step 4: Verify Migration

Expected output:
```
✓ All critical tables exist
✓ All foreign keys valid
✓ All sequences exist
✓ Database validation complete
```

### Step 5: Note Your Credentials

Save these from Neon dashboard:
- **Host:** `ep-xxxx-xxxx.region.aws.neon.tech`
- **Database:** `neondb`
- **User:** `neondb_owner`
- **Password:** (from connection string)
- **Port:** `5432`
- **SSL:** `require`

---

## B. Backend Deployment (Render)

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. **Name:** `tms-backend`
5. **Region:** Same as Neon (for low latency)
6. **Branch:** `main`
7. **Root Directory:** `backend`
8. **Runtime:** `Node`
9. **Build Command:** `npm install`
10. **Start Command:** `npm start`
11. **Instance Type:** Start with "Free" (upgrade for production)

### Step 2: Configure Environment Variables

Add these in Render → Environment:

```env
# Node Environment
NODE_ENV=production

# Server
PORT=5002

# Database (Neon)
PGHOST=ep-xxxx-xxxx.region.aws.neon.tech
PGPORT=5432
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=your_neon_password
DATABASE_URL=postgresql://neondb_owner:password@host/neondb?sslmode=require

# Redis (Upstash - will configure later)
REDIS_URL=rediss://default:password@host:port

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your_super_long_random_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_super_long_random_refresh_secret_here_min_32_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# OTP Configuration
OTP_EXPIRES_IN_MINUTES=5

# Booking Configuration
BOOKING_RESERVATION_MINUTES=15

# Payment (if applicable)
PAYMENT_WEBHOOK_SECRET=your_payment_webhook_secret
PAYMENT_SESSION_BASE_URL=https://your-payment-provider.com

# Email (Gmail)
EMAIL_USER=smartTransportserv@gmail.com
EMAIL_PASS=wrat egue ozeb psdi

# CORS (Update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app
```

### Step 3: Health Check Configuration

In Render settings:
- **Health Check Path:** `/api/v1/health`
- **Health Check Timeout:** 30 seconds

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://tms-backend.onrender.com`

---

## C. Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

Update `frontend/.env.production`:
```env
VITE_API_URL=https://tms-backend.onrender.com/api/v1
```

Or add to `frontend/vite.config.ts`:
```typescript
export default defineConfig({
  // ... existing config
  define: {
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://tms-backend.onrender.com/api/v1'
    ),
  },
})
```

### Step 2: Deploy to Vercel

**Option A: Via CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel --prod
```

**Option B: Via Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Framework Preset:** `Vite`
5. **Root Directory:** `frontend`
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. **Install Command:** `npm install`

### Step 3: Environment Variables

Add in Vercel → Settings → Environment Variables:
```env
VITE_API_URL=https://tms-backend.onrender.com/api/v1
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build (3-5 minutes)
3. Note your frontend URL: `https://tms.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## D. Redis Setup (Upstash)

### Step 1: Create Redis Database

1. Go to [Upstash Console](https://console.upstash.com)
2. Click "Create Database"
3. **Name:** `tms-redis`
4. **Type:** `Regional`
5. **Region:** Same as Render/Neon
6. **TLS:** Enabled
7. Click "Create"

### Step 2: Get Connection URL

From Upstash dashboard, copy:
- **Redis URL:** `rediss://default:xxxxx@region.upstash.io:6379`

### Step 3: Update Backend Environment

In Render → Environment Variables:
```env
REDIS_URL=rediss://default:xxxxx@region.upstash.io:6379
```

Redeploy backend after updating.

---

## E. Environment Variables

### Backend (.env for Render)

```env
# REQUIRED - Production Settings
NODE_ENV=production
PORT=5002

# REQUIRED - Database (Neon)
PGHOST=ep-xxxx-xxxx.region.aws.neon.tech
PGPORT=5432
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=your_neon_password

# REQUIRED - Redis (Upstash)
REDIS_URL=rediss://default:password@host:port

# REQUIRED - JWT Secrets (CHANGE THESE!)
JWT_SECRET=generate_a_strong_random_string_minimum_32_characters
JWT_REFRESH_SECRET=generate_another_strong_random_string_minimum_32_characters
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# REQUIRED - Email OTP
EMAIL_USER=smartTransportserv@gmail.com
EMAIL_PASS=wrat egue ozeb psdi

# REQUIRED - Frontend URL (for CORS)
FRONTEND_URL=https://tms.vercel.app

# OPTIONAL - Configuration
OTP_EXPIRES_IN_MINUTES=5
BOOKING_RESERVATION_MINUTES=15
PAYMENT_WEBHOOK_SECRET=your_payment_secret
PAYMENT_SESSION_BASE_URL=https://payment-provider.com
```

### Frontend (.env.production for Vercel)

```env
VITE_API_URL=https://tms-backend.onrender.com/api/v1
```

---

## F. Post-Deployment Verification

### 1. Test Backend Health

```bash
curl https://tms-backend.onrender.com/api/v1/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "redis": "connected"
  }
}
```

### 2. Test Database Connection

```bash
curl https://tms-backend.onrender.com/api/v1/trips/scheduled
```

### 3. Test Frontend

Visit: `https://tms.vercel.app`

Expected: Landing page loads without errors

### 4. Test Registration Flow

1. Go to frontend
2. Click "Sign Up"
3. Enter details
4. Check email for OTP
5. Verify OTP works

### 5. Test Login Flow

1. Go to frontend
2. Click "Sign In"
3. Enter credentials
4. Check email for OTP
5. Verify login successful

---

## G. Production Checklist

### Security

- [ ] ✅ JWT secrets are strong and unique
- [ ] ✅ Database password is secure
- [ ] ✅ Redis password is secure
- [ ] ✅ Email app password configured
- [ ] ✅ CORS configured for production domain
- [ ] ✅ HTTPS enabled (automatic on Vercel/Render)
- [ ] ✅ Rate limiting enabled
- [ ] ✅ No `.env` files committed to Git

### Database

- [ ] ✅ Neon database migrated successfully
- [ ] ✅ All tables exist
- [ ] ✅ All foreign keys valid
- [ ] ✅ All indexes created
- [ ] ✅ All triggers working
- [ ] ✅ All views accessible
- [ ] ✅ Extensions installed
- [ ] ✅ System admin user created

### Backend

- [ ] ✅ Deployed to Render
- [ ] ✅ Health check passing
- [ ] ✅ Environment variables configured
- [ ] ✅ Database connection working
- [ ] ✅ Redis connection working
- [ ] ✅ Email service working
- [ ] ✅ All API endpoints accessible
- [ ] ✅ Logs are clean (no errors)

### Frontend

- [ ] ✅ Deployed to Vercel
- [ ] ✅ Build successful
- [ ] ✅ API URL configured
- [ ] ✅ All pages load
- [ ] ✅ Authentication working
- [ ] ✅ Dashboard accessible
- [ ] ✅ Responsive design working

### Testing

- [ ] ✅ Registration works
- [ ] ✅ Email OTP received
- [ ] ✅ OTP verification works
- [ ] ✅ Login works
- [ ] ✅ Dashboard loads with data
- [ ] ✅ Booking flow works
- [ ] ✅ Payment integration works
- [ ] ✅ WebSocket tracking works

### Monitoring

- [ ] ✅ Set up error tracking (Sentry)
- [ ] ✅ Set up uptime monitoring
- [ ] ✅ Configure alerts
- [ ] ✅ Set up log aggregation

### Backups

- [ ] ✅ Neon automatic backups enabled
- [ ] ✅ Database backup schedule configured
- [ ] ✅ Backup restoration tested

### Documentation

- [ ] ✅ API documentation updated
- [ ] ✅ Deployment guide complete
- [ ] ✅ README updated with production URLs
- [ ] ✅ Environment variables documented

---

## 🎉 Deployment Complete!

Your Transportation Management System is now live in production!

### URLs
- **Frontend:** https://tms.vercel.app
- **Backend:** https://tms-backend.onrender.com
- **API Docs:** https://tms-backend.onrender.com/api/v1

### Support
- Check logs in Render dashboard
- Monitor database in Neon console
- View analytics in Vercel dashboard

---

## 🚨 Troubleshooting

### Backend won't start
1. Check Render logs
2. Verify all environment variables
3. Test database connection string locally
4. Check Neon database is active

### Frontend can't connect to backend
1. Verify CORS settings in backend
2. Check `VITE_API_URL` in Vercel
3. Ensure backend is deployed and healthy
4. Check browser console for errors

### Database connection fails
1. Verify Neon connection string
2. Check SSL mode is `require`
3. Verify database credentials
4. Check Neon project is not paused

### Redis connection fails
1. Verify Upstash URL format
2. Check Redis database is active
3. Ensure TLS is enabled
4. Test connection string locally

---

**🎊 Congratulations on deploying your Transportation Management System!**
