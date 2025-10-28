# 🔧 Fix Login Issue - Vercel Configuration Guide

## What Was Wrong
Your frontend couldn't connect to the backend API because:
1. ❌ CORS was blocking production requests
2. ❌ Frontend didn't know where the backend API is located

## What I Fixed
✅ Updated CORS settings in backend to allow Vercel deployments
✅ Configured frontend to use environment variable for API URL

---

## Step-by-Step: Configure Vercel

### Step 1: Find Your Backend URL

First, you need your backend API URL. It should look like:
- `https://prize-platform-api.onrender.com` (if using Render)
- `https://your-backend.railway.app` (if using Railway)
- Or whatever hosting service you used

**To find it:**
1. Go to your backend hosting dashboard (Render/Railway/etc.)
2. Look for the deployment URL
3. Copy it (including `https://`)

---

### Step 2: Add Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your `prize-platform` project

2. **Open Settings**
   - Click the "Settings" tab at the top

3. **Navigate to Environment Variables**
   - In the left sidebar, click "Environment Variables"

4. **Add New Variable**
   - Click "Add New" button
   - Fill in:
     - **Name:** `REACT_APP_API_URL`
     - **Value:** `https://your-backend-url.onrender.com` (replace with your actual backend URL)
     - **Environment:** Select all three (Production, Preview, Development)
   - Click "Save"

---

### Step 3: Redeploy Your Site

**Option A: Redeploy from Dashboard**
1. Go to the "Deployments" tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"
4. Confirm the redeployment

**Option B: Push to GitHub (if connected)**
1. The changes I made need to be pushed to GitHub
2. Run these commands in your terminal:

```bash
cd "C:\Users\Ryan Guy\CascadeProjects\prize-platform"
git add .
git commit -m "Fix CORS and API configuration for production"
git push
```

3. Vercel will automatically redeploy

---

### Step 4: Update Backend Environment Variables

You also need to tell your backend about your frontend URL:

1. **Go to your backend hosting dashboard** (Render/Railway)
2. **Find Environment Variables section**
3. **Add or update:**
   - **Name:** `CLIENT_URL`
   - **Value:** Your Vercel URL (e.g., `https://prize-platform.vercel.app`)
4. **Save and redeploy** the backend

---

## Quick Reference

### Environment Variables Needed

**In Vercel (Frontend):**
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

**In Render/Railway (Backend):**
```
CLIENT_URL=https://your-frontend.vercel.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

---

## Testing After Deployment

1. **Wait 2-3 minutes** for deployment to complete
2. **Visit your Vercel site**
3. **Open browser console** (F12 → Console tab)
4. **Try to login**
5. **Check for errors:**
   - ✅ No CORS errors = Fixed!
   - ❌ Still seeing errors? Check the troubleshooting section below

---

## Troubleshooting

### Still Getting CORS Errors?
- Make sure you saved the environment variable in Vercel
- Make sure you redeployed after adding the variable
- Check that the backend URL is correct (with `https://`)
- Verify backend is running (visit `https://your-backend-url/api/health`)

### Login Button Does Nothing?
- Open browser console (F12)
- Look for red error messages
- Check if API URL is being used (should show in Network tab)

### 404 Errors?
- Your backend might not be running
- Check backend deployment status
- Verify the API URL is correct

### Environment Variable Not Working?
- Make sure it starts with `REACT_APP_` (React requirement)
- Redeploy after adding the variable
- Clear browser cache and try again

---

## Visual Guide: Where to Find Things

### In Vercel:
```
Dashboard → Your Project → Settings → Environment Variables
```

### In Render:
```
Dashboard → Your Service → Environment → Add Environment Variable
```

### In Railway:
```
Dashboard → Your Project → Variables → New Variable
```

---

## What URLs Do You Need?

If you're not sure what your URLs are, tell me and I can help you find them!

**Backend URL:** Where your API is hosted
**Frontend URL:** Your Vercel deployment URL

---

## Need Help?

If you're stuck, just tell me:
1. What hosting service you're using for the backend (Render/Railway/other)
2. Any error messages you're seeing
3. Where you're stuck in the process

I'll help you through it! 🚀
