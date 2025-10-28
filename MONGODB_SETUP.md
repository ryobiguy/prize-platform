# MongoDB Atlas Setup Guide

## Why MongoDB Atlas?

- ✅ **Free Forever** - 512MB storage (enough for thousands of users)
- ✅ **No Installation** - Cloud-based, works immediately
- ✅ **Production Ready** - Same database for dev and production
- ✅ **Automatic Backups** - Your data is safe
- ✅ **Global** - Fast from anywhere

## Step-by-Step Setup (10 minutes)

### 1. Create Account

Go to: **https://www.mongodb.com/cloud/atlas/register**

- Sign up with Google (fastest) or email
- No credit card required for free tier

### 2. Create Free Cluster

After signing up:
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select **Cloud Provider**: AWS (recommended)
4. Select **Region**: Choose closest to your location
   - US: `us-east-1` (N. Virginia)
   - EU: `eu-west-1` (Ireland)
   - Asia: `ap-southeast-1` (Singapore)
5. **Cluster Name**: Leave as `Cluster0` or rename to `prize-platform`
6. Click **"Create"** (takes 3-5 minutes to provision)

### 3. Create Database User

While cluster is creating:
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. **Username**: `prizeadmin`
5. **Password**: Click "Autogenerate Secure Password" and **SAVE IT**
   - Example: `xK9mP2nQ7vL4sR8t`
6. **Database User Privileges**: Select "Read and write to any database"
7. Click **"Add User"**

### 4. Allow Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (all IPs)
   - ⚠️ This is fine for development
   - 🔒 For production, restrict to your server's IP
4. Click **"Confirm"**

### 5. Get Connection String

1. Go back to **"Database"** in left sidebar
2. Wait for cluster status to show **"Active"** (green)
3. Click **"Connect"** button on your cluster
4. Choose **"Connect your application"**
5. **Driver**: Node.js
6. **Version**: 4.1 or later
7. Copy the connection string:

```
mongodb+srv://prizeadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update Your .env File

1. Open `.env` file in your project root
2. Find the `MONGODB_URI` line
3. Replace with your connection string
4. **IMPORTANT**: Replace `<password>` with your actual password
5. Add `/prize-platform` before the `?` to specify database name

**Example:**
```env
MONGODB_URI=mongodb+srv://prizeadmin:xK9mP2nQ7vL4sR8t@cluster0.abc123.mongodb.net/prize-platform?retryWrites=true&w=majority
```

**Breakdown:**
- `prizeadmin` = your username
- `xK9mP2nQ7vL4sR8t` = your password (replace with yours!)
- `cluster0.abc123.mongodb.net` = your cluster URL
- `/prize-platform` = database name
- `?retryWrites=true&w=majority` = connection options

### 7. Test Connection

```bash
# Seed data to test connection
npm run seed:all
```

If successful, you'll see:
```
Connected to MongoDB
✅ Successfully seeded 5 prizes!
✅ Successfully seeded 15 monetizable tasks!
```

If you see an error:
- ❌ `Authentication failed` → Wrong password
- ❌ `Connection timeout` → Check network access settings
- ❌ `Invalid connection string` → Check format

## View Your Data

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"** on your cluster
3. You'll see:
   - `prizes` collection (5 documents)
   - `tasks` collection (15 documents)
   - `users` collection (created when first user registers)

## Production Tips

### Security
- Create separate database users for dev/production
- Use IP whitelisting in production
- Rotate passwords regularly
- Never commit `.env` to git

### Performance
- Free tier: 512MB storage, 100 connections
- Upgrade to M10 ($0.08/hour) when you hit limits
- Monitor usage in Atlas dashboard

### Backups
- Free tier: No automatic backups
- M10+: Continuous backups included
- Export data regularly: Database → Collections → Export

## Troubleshooting

### "MongooseError: Operation buffering timed out"
- Connection string is wrong
- Check username/password
- Check network access (0.0.0.0/0)
- Cluster might be paused (free tier pauses after 60 days inactivity)

### "Authentication failed"
- Password is wrong (check for special characters)
- User doesn't exist
- User doesn't have correct permissions

### "Connection refused"
- IP not whitelisted
- Cluster is still creating (wait 5 minutes)
- Check firewall/antivirus blocking connection

### "Database not found"
- Add database name to connection string: `/prize-platform`
- Database is created automatically on first write

## Alternative: Local MongoDB (Not Recommended)

If you really want local MongoDB:

**Windows:**
```bash
# Download MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Install and run
mongod --dbpath "C:\data\db"
```

**Use this in .env:**
```env
MONGODB_URI=mongodb://localhost:27017/prize-platform
```

**Why Atlas is better:**
- No installation needed
- Works on all computers
- Same database for dev and production
- Free forever
- Automatic backups
- Better performance

## Next Steps

Once MongoDB is connected:
1. ✅ Run `npm run seed:all` to add data
2. ✅ Run `npm run dev` to start app
3. ✅ Open http://localhost:3000
4. ✅ Register a user and test tasks
5. ✅ Check MongoDB Atlas to see data being created

## Support

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Community Forum: https://www.mongodb.com/community/forums/
- Free tier limits: https://www.mongodb.com/pricing
