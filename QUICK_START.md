# 🚀 Quick Start Guide - Get Running in 30 Minutes

## Step 1: MongoDB Atlas Setup (10 minutes)

1. **Create Free MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google/Email
   - Choose FREE M0 cluster (512MB)
   - Select region closest to you
   - Create cluster (takes 3-5 minutes)

2. **Configure Database Access**
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `prizeadmin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

3. **Configure Network Access**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://prizeadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

5. **Update .env File**
   ```
   MONGODB_URI=mongodb+srv://prizeadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prize-platform?retryWrites=true&w=majority
   ```

## Step 2: Install & Seed Data (5 minutes)

```bash
# Install all dependencies
npm run install-all

# Seed prizes and monetizable tasks
npm run seed:all
```

You should see:
```
✅ Successfully seeded 5 prizes!
✅ Successfully seeded 15 monetizable tasks!
📊 Revenue Potential Summary
Total estimated revenue per active user: $XX.XX/month
```

## Step 3: Run the Application (2 minutes)

```bash
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

## Step 4: Test the Platform (5 minutes)

1. **Open Browser**: http://localhost:3000
2. **Register Account**: Click "Register" → Create account
3. **View Prizes**: Browse available prizes
4. **Complete Tasks**: 
   - Go to "Tasks" page
   - Click "Watch Video Ad" → Watch 30s ad → Earn entries
   - Try other tasks (surveys, social media)
5. **Enter Prize Draw**: Use your entries to enter prizes
6. **Admin Panel**: 
   - Login with admin account (create one in MongoDB)
   - Access: http://localhost:3000/admin

## Step 5: Configure Monetization (Optional - Do Later)

### Google AdMob (Video Ads)
1. Sign up: https://admob.google.com/
2. Create app → Get App ID
3. Create "Rewarded Ad" unit → Get Ad Unit ID
4. Add to `.env`:
   ```
   ADMOB_APP_ID=ca-app-pub-xxxxx~xxxxx
   ADMOB_AD_UNIT_ID=ca-app-pub-xxxxx/xxxxx
   ```

### Survey Provider (Pollfish)
1. Sign up: https://www.pollfish.com/
2. Create account → Get API key
3. Add to `.env`:
   ```
   POLLFISH_API_KEY=your_api_key_here
   ```

### Email Notifications (SendGrid)
1. Sign up: https://sendgrid.com/
2. Create API key
3. Verify sender email
4. Add to `.env`:
   ```
   SENDGRID_API_KEY=SG.xxxxx
   FROM_EMAIL=noreply@yourdomain.com
   ```

## 🎯 What's Working Now

✅ **User Authentication** - Register, login, JWT tokens
✅ **Prize System** - Browse prizes, enter draws
✅ **Task System** - 15 monetizable tasks ready
✅ **Video Ad UI** - Complete ad watching flow
✅ **Social Media Tasks** - Twitter, Instagram, YouTube
✅ **Admin Panel** - Manage prizes and tasks
✅ **Responsive Design** - Works on mobile & desktop

## 💰 Revenue Tasks Ready

1. **Watch Video Ads** - $0.05 per view (repeatable daily)
2. **Complete Surveys** - $0.50-$3.00 per survey
3. **App Installs** - $1-$2 per install
4. **Email Signups** - $1.50 per signup
5. **Referrals** - $0.50 per new user
6. **Daily Login** - $0.01 per day (with ad)

## 📊 Expected Revenue (100 Daily Users)

- Video Ads: **$15/day** ($450/month)
- Surveys: **$60/day** ($1,800/month)
- App Installs: **$10/day** ($300/month)
- Referrals: **$5/day** ($150/month)
- **Total: ~$90/day = $2,700/month**

Prize costs: $500-1,000/month
**Net Profit: $1,700-2,200/month**

## 🚨 Before Launch Checklist

- [ ] MongoDB Atlas connected and working
- [ ] All tasks seeded and displaying
- [ ] User registration working
- [ ] Prize entry system working
- [ ] Admin panel accessible
- [ ] Mobile responsive tested
- [ ] Terms of Service created
- [ ] Privacy Policy created
- [ ] Social media accounts created
- [ ] First 3-5 real prizes added

## 🎉 Ready to Launch?

Once everything is working locally:
1. Choose hosting (Vercel + Railway recommended)
2. Deploy backend to Railway
3. Deploy frontend to Vercel
4. Update environment variables
5. Test production site
6. Announce launch!

## 🆘 Need Help?

Common issues:
- **MongoDB connection error**: Check connection string and password
- **Tasks not loading**: Run `npm run seed:monetizable`
- **Port already in use**: Kill process on port 3000/5000
- **Dependencies error**: Delete node_modules, run `npm run install-all`

## 📈 Growth Strategy

Week 1: Launch + seed users (friends, family)
Week 2: Social media marketing
Week 3: Influencer partnerships
Week 4: Paid ads ($100-500 budget)

Target: 100 users by end of month 1
