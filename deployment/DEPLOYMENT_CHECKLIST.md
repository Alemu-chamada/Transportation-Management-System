# 🚀 Production Deployment Checklist
## Transportation Management System

> **Use this checklist to ensure a complete and successful production deployment**

---

## 📋 Pre-Deployment Preparation

### 1. Code Repository
- [ ] All code committed to Git
- [ ] No `.env` files committed (check `.gitignore`)
- [ ] No sensitive data in code or comments
- [ ] README.md is up-to-date
- [ ] All test/demo files removed
- [ ] Repository pushed to GitHub

### 2. Environment Secrets
- [ ] Run `node deployment/generate-secrets.js`
- [ ] Save generated secrets to password manager
- [ ] JWT_SECRET generated (128 chars minimum)
- [ ] JWT_REFRESH_SECRET generated (different from JWT_SECRET)
- [ ] SESSION_SECRET generated
- [ ] PAYMENT_WEBHOOK_SECRET generated (if applicable)
- [ ] Email credentials ready: `smartTransportserv@gmail.com` + app password

### 3. Documentation Review
- [ ] Read `deployment/DEPLOYMENT_GUIDE.md` completely
- [ ] Review environment variable templates
- [ ] Understand database migration process
- [ ] Familiarize with backup/restore procedures

---

## 🗄️ Database Deployment (Neon)

### 1. Create Neon Project
- [ ] Sign up at https://neon.tech
- [ ] Create new project: `tms-production`
- [ ] Select region closest to users
- [ ] PostgreSQL version 16
- [ ] Note connection details

### 2. Database Migration
- [ ] Copy Neon connection string
- [ ] Export local database: `pg_dump localhost > local_backup.sql`
- [ ] Import to Neon: `psql "neon_connection_string" -f local_backup.sql`
- [ ] Run setup script: `psql "neon_connection_string" -f deployment/neon-database-setup.sql`
- [ ] Run validation: `psql "neon_connection_string" -f deployment/database-validation.sql`
- [ ] Verify all tables exist
- [ ] Verify all views exist
- [ ] Verify all triggers exist
- [ ] Verify all foreign keys valid

### 3. Database Configuration
- [ ] Record PGHOST
- [ ] Record PGPORT (5432)
- [ ] Record PGDATABASE (neondb)
- [ ] Record PGUSER (neondb_owner)
- [ ] Record PGPASSWORD
- [ ] Test connection: `psql "connection_string" -c "SELECT 1"`

### 4. Create System Admin User
```sql
-- Run this in Neon console to create admin user
-- IMPORTANT: Replace the password hash with bcrypt hash of your chosen password
INSERT INTO users (
    id, email, phone, password_hash, first_name, last_name,
    role, is_active, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'admin@tms.system',
    '+1234567890',
    '$2b$10$YourHashedPasswordHere', -- CHANGE THIS!
    'System',
    'Administrator',
    'system_admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;
```
- [ ] System admin user created
- [ ] Admin password securely stored
- [ ] Admin can log in after deployment

---

## 💾 Redis Setup (Upstash)

### 1. Create Redis Instance
- [ ] Sign up at https://upstash.com
- [ ] Create new database: `tms-redis`
- [ ] Select same region as Neon/Render
- [ ] Enable TLS
- [ ] Copy connection URL (starts with `rediss://`)

### 2. Configuration
- [ ] Record REDIS_URL
- [ ] Verify URL format: `rediss://default:password@host:port`
- [ ] Test connection: `redis-cli -u "rediss://..."`

---

## 🖥️ Backend Deployment (Render)

### 1. Create Web Service
- [ ] Sign up at https://render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Service name: `tms-backend`
- [ ] Region: Same as Neon (for low latency)
- [ ] Branch: `main`
- [ ] Root directory: `backend`
- [ ] Runtime: Node
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Instance type: Starter (minimum)

### 2. Environment Variables
Add all variables from `deployment/.env.backend.production.template`:

#### Required - Copy values exactly
- [ ] NODE_ENV=production
- [ ] PORT=5002
- [ ] PGHOST (from Neon)
- [ ] PGPORT=5432
- [ ] PGDATABASE (from Neon)
- [ ] PGUSER (from Neon)
- [ ] PGPASSWORD (from Neon)
- [ ] REDIS_URL (from Upstash)
- [ ] JWT_SECRET (from generate-secrets.js)
- [ ] JWT_REFRESH_SECRET (from generate-secrets.js)
- [ ] JWT_EXPIRES_IN=1h
- [ ] JWT_REFRESH_EXPIRES_IN=7d
- [ ] EMAIL_USER=smartTransportserv@gmail.com
- [ ] EMAIL_PASS=wrat egue ozeb psdi
- [ ] OTP_EXPIRES_IN_MINUTES=5
- [ ] BOOKING_RESERVATION_MINUTES=15
- [ ] SESSION_SECRET (from generate-secrets.js)

#### Update after frontend deployment
- [ ] FRONTEND_URL (placeholder: https://tms.vercel.app)
- [ ] ALLOWED_ORIGINS (placeholder: https://tms.vercel.app)

#### Optional (if using payments)
- [ ] PAYMENT_WEBHOOK_SECRET
- [ ] PAYMENT_SESSION_BASE_URL

### 3. Health Check Configuration
- [ ] Health check path: `/api/v1/health`
- [ ] Health check timeout: 30 seconds

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Check logs for errors
- [ ] Record backend URL (e.g., `https://tms-backend.onrender.com`)

### 5. Verify Backend
```bash
# Test health endpoint
curl https://tms-backend.onrender.com/api/v1/health

# Expected response:
# {
#   "success": true,
#   "data": {
#     "status": "healthy",
#     "components": {
#       "database": { "status": "healthy" },
#       "redis": { "status": "healthy" }
#     }
#   }
# }
```
- [ ] Backend URL accessible
- [ ] Health check returns 200 OK
- [ ] Database status: healthy
- [ ] Redis status: healthy
- [ ] No errors in logs

---

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend
Create `frontend/.env.production`:
```env
VITE_API_URL=https://tms-backend.onrender.com/api/v1
```
- [ ] Environment file created
- [ ] Backend URL is correct

### 2. Deploy to Vercel

#### Option A: Via Dashboard (Recommended)
- [ ] Sign up at https://vercel.com
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository
- [ ] Framework preset: Vite
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Add environment variable: `VITE_API_URL`
- [ ] Click "Deploy"

#### Option B: Via CLI
```bash
npm install -g vercel
cd frontend
vercel --prod
```
- [ ] Vercel CLI installed
- [ ] Deployed successfully

### 3. Environment Variables (Vercel Dashboard)
- [ ] VITE_API_URL=https://tms-backend.onrender.com/api/v1

### 4. Deployment
- [ ] Build successful (3-5 minutes)
- [ ] No build errors
- [ ] Record frontend URL (e.g., `https://tms.vercel.app`)

### 5. Update Backend CORS
Go back to Render → Backend → Environment:
- [ ] Update FRONTEND_URL with actual Vercel URL
- [ ] Update ALLOWED_ORIGINS with actual Vercel URL
- [ ] Redeploy backend
- [ ] Wait for backend to restart

### 6. Verify Frontend
- [ ] Open frontend URL in browser
- [ ] Landing page loads without errors
- [ ] No console errors in browser DevTools
- [ ] Inspect Network tab - API calls reach backend
- [ ] Responsive design works on mobile

---

## 🧪 End-to-End Testing

### 1. Registration Flow
- [ ] Navigate to Sign Up page
- [ ] Fill in registration form (email, phone, name, password)
- [ ] Submit registration
- [ ] OTP sent to email
- [ ] Check email inbox for OTP
- [ ] Enter OTP in frontend
- [ ] Registration successful
- [ ] Redirected to dashboard

### 2. Login Flow
- [ ] Navigate to Sign In page
- [ ] Enter registered email/phone and password
- [ ] Submit login
- [ ] OTP sent to email
- [ ] Check email inbox for OTP
- [ ] Enter OTP in frontend
- [ ] Login successful
- [ ] JWT token stored
- [ ] Redirected to dashboard

### 3. Dashboard Access
- [ ] Dashboard loads with user data
- [ ] Metrics display (users, trips, bookings, revenue)
- [ ] Charts render correctly
- [ ] Recent activity shows
- [ ] Backend health indicator is green
- [ ] Non-admin users see dashboard without admin sections
- [ ] Admin users see full dashboard with admin controls

### 4. API Endpoints
Test critical endpoints:
```bash
# Health
curl https://tms-backend.onrender.com/api/v1/health

# Scheduled trips (public)
curl https://tms-backend.onrender.com/api/v1/trips/scheduled

# Auth endpoints
curl -X POST https://tms-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","first_name":"Test","last_name":"User"}'
```
- [ ] All endpoints respond correctly
- [ ] Proper HTTP status codes
- [ ] No 500 Internal Server Errors

### 5. Error Scenarios
- [ ] Test with invalid OTP → shows error
- [ ] Test with expired OTP → shows error
- [ ] Test login with wrong password → shows error
- [ ] Test registration with duplicate email → shows error
- [ ] Test API with invalid JWT → returns 401
- [ ] Test API without JWT → returns 401

---

## 🔒 Security Verification

### 1. Environment Security
- [ ] No `.env` files in repository
- [ ] All secrets stored in platform dashboards
- [ ] JWT secrets are strong (128+ chars)
- [ ] Database password is strong
- [ ] Email app password configured
- [ ] No hardcoded credentials in code

### 2. SSL/TLS
- [ ] Frontend uses HTTPS (automatic on Vercel)
- [ ] Backend uses HTTPS (automatic on Render)
- [ ] Database connection uses SSL (`?sslmode=require`)
- [ ] Redis connection uses TLS (`rediss://`)
- [ ] No mixed content warnings

### 3. CORS Configuration
- [ ] CORS allows only frontend domain
- [ ] CORS credentials enabled
- [ ] Preflight requests work
- [ ] Test from frontend - no CORS errors

### 4. Authentication
- [ ] Passwords hashed with bcrypt
- [ ] JWTs signed with strong secret
- [ ] Tokens have expiration
- [ ] Refresh tokens implemented
- [ ] OTP codes hashed in database
- [ ] OTP expiration enforced

### 5. Rate Limiting
- [ ] Test rapid API requests
- [ ] Rate limiting active (if configured)
- [ ] Brute force protection on login

---

## 📊 Monitoring & Logging

### 1. Backend Monitoring (Render)
- [ ] Check Render dashboard
- [ ] View deployment logs
- [ ] Check runtime logs for errors
- [ ] Set up log alerts
- [ ] Configure uptime monitoring

### 2. Frontend Monitoring (Vercel)
- [ ] Check Vercel dashboard
- [ ] View build logs
- [ ] Check analytics
- [ ] View function logs (if any)
- [ ] Set up deployment notifications

### 3. Database Monitoring (Neon)
- [ ] Check Neon console
- [ ] View connection stats
- [ ] Check query performance
- [ ] Verify backup schedule
- [ ] Set up usage alerts

### 4. Redis Monitoring (Upstash)
- [ ] Check Upstash console
- [ ] View connection stats
- [ ] Check memory usage
- [ ] Verify data persistence settings

### 5. Error Tracking (Optional)
- [ ] Install Sentry (optional but recommended)
- [ ] Configure Sentry DSN in backend
- [ ] Configure Sentry DSN in frontend
- [ ] Test error reporting
- [ ] Set up error alerts

---

## 💾 Backup Strategy

### 1. Database Backups
- [ ] Neon automatic backups enabled (included in plan)
- [ ] Manual backup script tested: `./deployment/backup-database.sh`
- [ ] First manual backup created
- [ ] Backup stored securely
- [ ] Restore script tested: `./deployment/restore-database.sh`
- [ ] Backup schedule documented

### 2. Code Backups
- [ ] Code in GitHub (primary)
- [ ] Repository not set to private (or backup access configured)
- [ ] Important branches protected

### 3. Backup Testing
- [ ] Restore process tested on staging environment
- [ ] Recovery time objective (RTO) documented
- [ ] Recovery point objective (RPO) documented

---

## 📈 Performance Optimization

### 1. Backend
- [ ] Database queries optimized (indexes)
- [ ] Connection pooling configured (pool size: 20)
- [ ] Redis caching working
- [ ] Compression enabled
- [ ] Keep-alive enabled

### 2. Frontend
- [ ] Build optimization (Vite)
- [ ] Code splitting enabled
- [ ] Assets compressed
- [ ] Images optimized
- [ ] Lazy loading implemented (if applicable)
- [ ] CDN caching (automatic on Vercel)

### 3. Database
- [ ] Indexes on foreign keys
- [ ] Indexes on frequently queried columns
- [ ] ANALYZE run after migration
- [ ] Query performance tested

---

## 🔄 CI/CD Setup (Optional)

### 1. GitHub Actions
- [ ] Copy `deployment/.github-workflows-deploy.yml` to `.github/workflows/deploy.yml`
- [ ] Add GitHub Secrets:
  - [ ] VERCEL_TOKEN
  - [ ] VERCEL_ORG_ID
  - [ ] VERCEL_PROJECT_ID
  - [ ] RENDER_DEPLOY_HOOK_URL
  - [ ] BACKEND_URL
  - [ ] FRONTEND_URL
- [ ] Test workflow: push to main branch
- [ ] Verify auto-deployment works

### 2. Render Auto-Deploy
- [ ] Enable auto-deploy on Render
- [ ] Set branch: `main`
- [ ] Test: push to main → auto-deploys

### 3. Vercel Auto-Deploy
- [ ] Enable auto-deploy on Vercel (default)
- [ ] Set production branch: `main`
- [ ] Test: push to main → auto-deploys

---

## 📱 WebSocket Testing (Optional)

If using real-time tracking:
- [ ] WebSocket connection established
- [ ] CORS allows WebSocket connections
- [ ] Authentication working for Socket.IO
- [ ] Location updates working
- [ ] Test from multiple clients
- [ ] No connection drops

---

## 📞 Support & Communication

### 1. Team Communication
- [ ] Deployment timeline communicated
- [ ] Downtime window announced (if any)
- [ ] Rollback plan documented
- [ ] Emergency contacts shared

### 2. User Communication
- [ ] Users notified of new system (if migrating)
- [ ] Support email/contact configured
- [ ] Help documentation updated

---

## 🎉 Post-Deployment

### 1. Verification Summary
- [ ] All systems operational
- [ ] All tests passed
- [ ] No critical errors in logs
- [ ] Performance acceptable
- [ ] Security checklist complete

### 2. Documentation
- [ ] Update README with production URLs
- [ ] Document deployment date
- [ ] Update API documentation
- [ ] Create runbook for common issues

### 3. Monitoring Schedule
- [ ] Check logs daily (first week)
- [ ] Monitor performance metrics
- [ ] Review error rates
- [ ] Check database performance
- [ ] Verify backups running

### 4. Next Steps
- [ ] Plan first maintenance window
- [ ] Schedule secret rotation (90 days)
- [ ] Plan capacity review (30 days)
- [ ] Schedule security audit
- [ ] Plan feature roadmap

---

## ✅ Final Sign-Off

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Verified By:** _________________  

### Production URLs
- **Frontend:** _________________________________
- **Backend:** _________________________________
- **Database:** _________________________________
- **Redis:** _________________________________

### Critical Secrets Stored In:
- [ ] Password Manager: _________________
- [ ] Team Documentation: _________________
- [ ] Secure Backup Location: _________________

---

## 🚨 Rollback Plan

If issues occur:

### Quick Rollback (Render)
1. Go to Render Dashboard → Your Service
2. Click "Deployments" tab
3. Find previous successful deployment
4. Click "Redeploy"

### Quick Rollback (Vercel)
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Find previous successful deployment
4. Click "..." → "Promote to Production"

### Database Rollback
```bash
# Restore from backup
./deployment/restore-database.sh backups/tms_backup_YYYYMMDD_HHMMSS.sql.gz
```

### Emergency Contacts
- **Backend Admin:** _________________
- **Frontend Admin:** _________________
- **Database Admin:** _________________
- **DevOps Lead:** _________________

---

**🎊 Congratulations on successfully deploying your Transportation Management System!**

