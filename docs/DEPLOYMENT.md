# Live Demo Deployment Guide

Deploy Smart Inventory for ThemeForest reviewers and buyers.

## Quick Deploy (Vercel)

### 1. MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create database user and get connection string
3. Network Access: allow `0.0.0.0/0` for demo (or Vercel IP ranges for production)

### 2. Vercel Frontend
```bash
npm i -g vercel
vercel login
vercel
```

Set these environment variables in Vercel dashboard:

| Variable | Example |
|----------|---------|
| MONGODB_URI | mongodb+srv://... |
| JWT_SECRET | long-random-string |
| NEXT_PUBLIC_APP_URL | https://your-app.vercel.app |

### 3. Test Live Demo
1. Open `https://your-app.vercel.app/login`
2. Click **Load Demo Data & Login**
3. Verify dashboard shows products and inventory

### 4. Socket Server (Optional)
```bash
cd backend/server
# Deploy to Railway/Render with MONGODB_URI and SOCKET_PORT
```
Set `NEXT_PUBLIC_SOCKET_URL` on Vercel to the socket server URL.

## Capture Screenshots After Deploy
```bash
CAPTURE_BASE_URL=https://your-app.vercel.app npm run capture:assets
```

## ThemeForest Item Fields
- **Live Preview URL**: your Vercel URL
- **Demo Admin**: admin@inventory.com / admin123 (use Load Demo Data button)
- **Documentation**: include `documentation/` folder in ZIP
