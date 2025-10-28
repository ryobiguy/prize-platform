# 🚀 Prize Platform Deployment Guide

You've signed up for:
- ✅ Vercel (Frontend hosting)
- ✅ Render (Backend hosting)
- ✅ MongoDB Atlas (Database)

Now let's deploy your platform step by step!

---

## 📦 Step 1: Prepare Your Code

### 1.1 Create GitHub Repository

If you haven't already:

```bash
cd "C:\Users\Ryan Guy\CascadeProjects\prize-platform"
git init
git add .
git commit -m "Initial commit - Prize Platform"
```

Then create a new repository on GitHub:
1. Go to https://github.com/new
2. Name it: `prize-platform`
3. Don't initialize with README (you already have code)
4. Click "Create repository"

Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/prize-platform.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Step 2: Set Up MongoDB Atlas

### 2.1 Create Database Cluster

1. Go to https://cloud.mongodb.com
2. Click "Build a Database"
3. Choose **FREE** tier (M0 Sandbox)
4. Select a region close to you (e.g., London/Ireland for UK)
5. Name your cluster: `prize-platform`
6. Click "Create"

### 2.2 Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `prizeplatform`
5. Password: Generate a strong password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 2.3 Whitelist IP Addresses

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Render to connect
4. Click "Confirm"

### 2.4 Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://prizeplatform:<password>@prize-platform.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `/prizeplatform`

**Final string should look like:**
```
mongodb+srv://prizeplatform:YOUR_PASSWORD@prize-platform.xxxxx.mongodb.net/prizeplatform?retryWrites=true&w=majority
```

**Save this connection string!** You'll need it for Render.

---

## 🔧 Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your `prize-platform` repository
5. Click "Connect"

### 3.2 Configure Service

**Basic Settings:**
- **Name:** `prize-platform-api`
- **Region:** Choose closest to you (e.g., Frankfurt for UK)
- **Branch:** `main`
- **Root Directory:** `server` (important!)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`

**Instance Type:**
- Choose **Free** to start

### 3.3 Add Environment Variables

Click "Advanced" and add these environment variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://prizeplatform:YOUR_PASSWORD@prize-platform.xxxxx.mongodb.net/prizeplatform?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
CLIENT_URL=https://your-app-name.vercel.app
SENDGRID_API_KEY=(leave empty for now)
FROM_EMAIL=noreply@yoursite.com
ADMIN_EMAIL=admin@yoursite.com
```

**Important:**
- Replace `MONGO_URI` with your actual MongoDB connection string
- Replace `JWT_SECRET` with a random secure string (use a password generator)
- We'll update `CLIENT_URL` after deploying frontend

### 3.4 Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://prize-platform-api.onrender.com`
4. **Save this URL!** You'll need it for Vercel

### 3.5 Test Backend

Once deployed, test it:
```
https://prize-platform-api.onrender.com/api/health
```

Should return: `{"status": "ok"}`

---

## 🎨 Step 4: Deploy Frontend to Vercel

### 4.1 Prepare Frontend

First, update your API URL in the client:

**Create/Update:** `client/.env.production`

```env
REACT_APP_API_URL=https://prize-platform-api.onrender.com
```

Commit this change:
```bash
git add client/.env.production
git commit -m "Add production API URL"
git push
```

### 4.2 Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Click "Import" on `prize-platform`

### 4.3 Configure Project

**Framework Preset:** Create React App (auto-detected)

**Root Directory:** Click "Edit" and set to `client`

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

**Environment Variables:**
Add this:
```
REACT_APP_API_URL=https://prize-platform-api.onrender.com
```

### 4.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://prize-platform-xxxxx.vercel.app`
4. **Save this URL!**

### 4.5 Update Backend with Frontend URL

Go back to Render:
1. Go to your web service
2. Click "Environment"
3. Update `CLIENT_URL` to your Vercel URL
4. Click "Save Changes"
5. Service will redeploy automatically

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test Frontend
Visit your Vercel URL: `https://prize-platform-xxxxx.vercel.app`

You should see your homepage with the banner!

### 5.2 Test Registration
1. Click "Sign Up"
2. Create a test account
3. Should redirect to dashboard

### 5.3 Test Database
Check MongoDB Atlas:
1. Go to "Database" → "Browse Collections"
2. You should see `users` collection with your test user

### 5.4 Test Admin Panel
1. Go to MongoDB Atlas → Browse Collections
2. Find your user in `users` collection
3. Click "Edit Document"
4. Change `"role": "user"` to `"role": "admin"`
5. Click "Update"
6. Go to `/admin` on your site
7. You should see the admin panel!

---

## 🌐 Step 6: Add Custom Domain (Optional)

### 6.1 Buy Domain

Buy from Namecheap, Google Domains, or Cloudflare:
- Example: `yourprizesite.com`
- Cost: ~£10/year

### 6.2 Add to Vercel

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS instructions
5. Wait for SSL certificate (automatic)

### 6.3 Update Environment Variables

Update `CLIENT_URL` in Render to your custom domain.

---

## 🔒 Step 7: Security Checklist

### 7.1 Environment Variables
- ✅ Never commit `.env` files to GitHub
- ✅ Use strong JWT_SECRET
- ✅ Use strong MongoDB password

### 7.2 MongoDB Security
- ✅ Database user has limited permissions
- ✅ Connection string is secure
- ✅ Regular backups enabled (in Atlas settings)

### 7.3 CORS Settings
Already configured in your backend to only allow your frontend domain.

---

## 📊 Step 8: Monitoring & Maintenance

### 8.1 Render Monitoring
- Check logs: Dashboard → Your Service → Logs
- Monitor uptime
- Check for errors

### 8.2 Vercel Analytics
- Enable in project settings
- Track page views
- Monitor performance

### 8.3 MongoDB Monitoring
- Check "Metrics" tab in Atlas
- Monitor storage usage
- Set up alerts

---

## 💰 Step 9: Scaling (When Ready)

### When to Upgrade:

**Render Free Tier Limits:**
- ⚠️ Spins down after 15 min of inactivity
- ⚠️ 750 hours/month
- ⚠️ Limited memory

**Upgrade to Starter ($7/month) when:**
- You have regular users
- Need 24/7 uptime
- Need faster performance

**MongoDB Free Tier Limits:**
- ⚠️ 512MB storage
- ⚠️ Shared cluster

**Upgrade to M2 ($9/month) when:**
- Storage > 400MB
- Need better performance
- Have 100+ users

**Vercel Free Tier:**
- ✅ Usually sufficient for most projects
- Upgrade to Pro ($20/month) for:
  - Custom domains on team
  - More bandwidth
  - Priority support

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` in Vercel
- Check CORS settings in backend
- Check Render service is running

### Database connection failed
- Check MongoDB connection string
- Check IP whitelist (0.0.0.0/0)
- Check database user credentials

### 500 errors on backend
- Check Render logs
- Check environment variables
- Check MongoDB connection

### Images not loading
- Check files are in `client/public/`
- Check file names match code
- Hard refresh browser (Ctrl+Shift+R)

---

## 🎉 Success Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas connected
- [ ] Can register new user
- [ ] Can login
- [ ] Can view prizes
- [ ] Admin panel accessible
- [ ] Banner image displays
- [ ] Mobile responsive

---

## 📝 Important URLs to Save

**Backend API:**
```
https://prize-platform-api.onrender.com
```

**Frontend:**
```
https://prize-platform-xxxxx.vercel.app
```

**MongoDB:**
```
https://cloud.mongodb.com
```

**Admin Panel:**
```
https://your-site.com/admin
```

---

## 🚀 Next Steps After Deployment

1. **Add Real Prizes**
   - Go to admin panel
   - Create actual prizes with images

2. **Set Up Email (SendGrid)**
   - Get API key from SendGrid
   - Add to Render environment variables
   - Test winner notifications

3. **Add Content**
   - Update About page
   - Add FAQ content
   - Customize branding

4. **Test Everything**
   - Full user journey
   - Mobile devices
   - Different browsers

5. **Launch Marketing**
   - Share on social media
   - Tell friends/family
   - Start promoting!

---

## 💡 Pro Tips

1. **Free Tier Limitations:**
   - Render free tier sleeps after 15 min
   - First request after sleep takes ~30 seconds
   - Consider upgrading for production

2. **Automatic Deployments:**
   - Push to GitHub = auto-deploy
   - Test locally before pushing
   - Use branches for testing

3. **Environment Variables:**
   - Keep them secret
   - Never commit to GitHub
   - Update when needed

4. **Backups:**
   - MongoDB Atlas has automatic backups
   - Export data regularly
   - Keep local copy of important data

---

## 🆘 Need Help?

**Render Docs:** https://render.com/docs
**Vercel Docs:** https://vercel.com/docs
**MongoDB Docs:** https://docs.mongodb.com

**Common Issues:**
- Check logs first
- Verify environment variables
- Test API endpoints directly
- Check browser console for errors

---

## 🎊 Congratulations!

Your prize platform is now live on the internet! 🚀

**What you've accomplished:**
✅ Professional hosting setup
✅ Scalable infrastructure
✅ Secure database
✅ Automatic deployments
✅ Production-ready platform

**You're ready to launch!** 🎉
