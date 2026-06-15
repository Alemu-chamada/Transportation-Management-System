# ⚡ Quick Start Deployment Guide
## Transportation Management System

> **For experienced developers who want to deploy quickly**

---

## 🚀 5-Minute Deployment

### 1. Generate Secrets (1 minute)
```bash
cd deployment
node generate-secrets.js
# Save the output - you'll need it!
```

### 2. Deploy Database - Neon (2 minutes)
```bash
# Create project at https://console.neon.tech
# Copy connection string, then:
psql "YOUR_NEON_CONNECTION_STRING" -f neon-database-setup.sql
psql "YOUR_NEON_CONNECTION_STRING" -f database-validation.sql
```

### 3. Deploy Backend - Render (1 minute)
1. Go to https://dashboard.render.com
2. New+ → Web Service → Connect your GitHub repo
3. Settings:
   - Name: `tms-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Add environment variables from `.env.backend.production.template`
4. Deploy!

### 4. Deploy Frontend - Vercel (1 minute)
```bash
npm install -g vercel
cd frontend
VITE_API_URL=https://your-backend.onrender.com/api/v1 vercel --prod
```

### 5. Create Redis - Upstash (30 seconds)
1. Go to https://console.upstash.com
2. Create Database → Copy URL
3. Add `REDIS_URL` to Render backend environment
4. Redeploy backend

### 6. Update CORS (30 seconds)
In Render backend environment:
```
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```
Redeploy backend.

---

## 📋 Essential Environment Variables

### Backend (Render)
```env
NODE_ENV=production
PORT=5002
PGHOST=your-neon-host
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=your-neon-password
REDIS_URL=rediss://your-upstash-url
JWT_SECRET=your-generated-secret
JWT_REFRESH_SECRET=your-generated-refresh-secret
EMAIL_USER=smartTransportserv@gmail.com
EMAIL_PASS=wrat egue ozeb psdi
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

---

## 🧪 Quick Test Commands

### Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/api/v1/health

# Scheduled trips
curl https://your-backend.onrender.com/api/v1/trips/scheduled
```

### Test Frontend
1. Open `https://your-app.vercel.app`
2. Register new account
3. Check email for OTP
4. Verify OTP
5. Access dashboard

---

## ✅ Success Criteria

- [ ] Backend health returns `"status": "healthy"`
- [ ] Frontend loads without console errors
- [ ] OTP emails received
- [ ] Login works
- [ ] Dashboard displays data

---

## 🚨 Common Issues

### Backend won't start
- Check all environment variables are set
- Verify Neon connection string
- Check logs in Render dashboard

### Frontend can't reach backend
- Update `FRONTEND_URL` in Render backend
- Update `VITE_API_URL` in Vercel frontend
- Check CORS configuration

### Database connection fails
- Verify `?sslmode=require` in connection string
- Check Neon project is active
- Test connection locally: `psql "connection_string" -c "SELECT 1"`

### OTP not received
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Check email spam folder
- Check backend logs for email send errors

---

## 📚 Full Documentation

For detailed step-by-step instructions, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment walkthrough
- `DEPLOYMENT_CHECKLIST.md` - Comprehensive checklist with verification steps

---

## 🎯 Production URLs

After deployment, update these in your documentation:
```
Frontend: https://your-app.vercel.app
Backend:  https://your-backend.onrender.com
Health:   https://your-backend.onrender.com/api/v1/health
```

---

## 🔐 Security Reminders

✅ Never commit `.env` files  
✅ Use strong secrets (128+ chars)  
✅ Rotate secrets every 90 days  
✅ Enable 2FA on all platforms  
✅ Store secrets in password manager  

---

**🎊 You're live! Need help? Check `DEPLOYMENT_GUIDE.md` for troubleshooting.**
