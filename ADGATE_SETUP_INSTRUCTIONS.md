# 🎯 AdGate Media Setup Instructions

## ✅ What I've Built While You Sign Up:

1. **OfferWall Component** - Beautiful UI to display AdGate offers
2. **Backend API** - Tracks offer completions and awards entries
3. **User Model Update** - Stores completed offers history
4. **Tasks Page Integration** - New "Offer Wall" tab

---

## 📝 Steps to Complete Setup:

### Step 1: Get Your Publisher ID from AdGate

After signing up at https://adgatemedia.com/:

1. Log in to your AdGate dashboard
2. Go to **"Tools"** → **"Offer Wall"**
3. Look for your **Publisher ID** (it's a number, like `12345`)
4. Copy it

### Step 2: Get Your Secret Key

1. Still in AdGate dashboard
2. Go to **"Settings"** → **"API Settings"** or **"Postback Settings"**
3. Find your **Secret Key** (used to verify postbacks)
4. Copy it

### Step 3: Add to Your .env File

Open `.env` file and add these two lines:

```env
# AdGate Media Configuration
REACT_APP_ADGATE_PUBLISHER_ID=YOUR_PUBLISHER_ID_HERE
ADGATE_SECRET_KEY=YOUR_SECRET_KEY_HERE
```

**Example:**
```env
REACT_APP_ADGATE_PUBLISHER_ID=12345
ADGATE_SECRET_KEY=abc123def456ghi789
```

### Step 4: Configure Postback URL in AdGate

This is CRITICAL - it's how AdGate tells your server when users complete offers.

1. In AdGate dashboard, go to **"Settings"** → **"Postback URL"**
2. Set your postback URL to:

**For Local Testing:**
```
http://localhost:5000/api/offers/adgate/postback?user_id={user_id}&points={points}&offer_id={offer_id}&ip={ip}&hash={hash}
```

**For Production (after deployment):**
```
https://yourdomain.com/api/offers/adgate/postback?user_id={user_id}&points={points}&offer_id={offer_id}&ip={ip}&hash={hash}
```

3. **Important:** Use the exact URL with the placeholders `{user_id}`, `{points}`, etc. - AdGate will replace these automatically

### Step 5: Restart Your Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 6: Test It!

1. Go to `http://localhost:3000/tasks`
2. Click the **"Offer Wall (Earn More!)"** tab
3. You should see the AdGate offer wall loaded
4. Complete a test offer
5. Check if entries are awarded automatically

---

## 🔧 How It Works:

### User Flow:
1. User clicks "Offer Wall" tab on Tasks page
2. Sees available offers (videos, surveys, app installs)
3. Completes an offer
4. AdGate sends postback to your server
5. Server verifies and awards entries
6. User sees updated entry count

### Revenue Flow:
1. User completes offer worth $0.75
2. AdGate credits your account $0.75
3. User receives entries (you decide conversion rate)
4. You get paid weekly/monthly by AdGate

---

## 💰 Entry Conversion Rate

Currently set to: **1 AdGate point = 1 entry**

You can adjust this in `/server/routes/offers.js`:

```javascript
// Line 24: Convert points to entries
const entries = parseInt(points); // Change this formula as needed

// Examples:
// const entries = parseInt(points) * 2; // 1 point = 2 entries
// const entries = Math.floor(parseInt(points) / 10); // 10 points = 1 entry
```

**Recommendation:** Start with 1:1 ratio, adjust based on user engagement.

---

## 🧪 Testing Checklist:

- [ ] Publisher ID added to .env
- [ ] Secret Key added to .env
- [ ] Postback URL configured in AdGate
- [ ] Server restarted
- [ ] Offer Wall loads on /tasks page
- [ ] Test offer completed
- [ ] Entries awarded automatically
- [ ] User stats updated

---

## 🚨 Troubleshooting:

### Offer Wall Not Loading?
- Check `.env` has `REACT_APP_ADGATE_PUBLISHER_ID`
- Restart React dev server
- Check browser console for errors

### Offers Complete But No Entries?
- Check postback URL is correct in AdGate
- Check server logs for postback errors
- Verify Secret Key matches
- Check user ID is being passed correctly

### "Invalid hash" Error?
- Secret Key doesn't match
- Update `ADGATE_SECRET_KEY` in `.env`
- Restart server

---

## 📊 Monitoring Revenue:

### In AdGate Dashboard:
- View daily earnings
- See conversion rates
- Track which offers perform best

### In Your Admin Panel:
- Go to `/admin`
- See user offer completion stats
- Track total entries awarded

---

## 🎉 You're All Set!

Once configured, users can:
- ✅ Complete video ads (30 seconds)
- ✅ Fill out surveys ($1-5 each)
- ✅ Install apps ($0.50-2 each)
- ✅ Sign up for trials ($2-10 each)

**You earn money, users earn entries - everyone wins!**

---

## 💡 Next Steps After Setup:

1. **Test thoroughly** - Complete a few offers yourself
2. **Adjust entry rates** - Find the right balance
3. **Promote offer wall** - Tell users it's the best way to earn
4. **Monitor performance** - Check which offers convert best
5. **Scale up** - Add more offer wall providers (OfferToro, CPAGrip)

---

**Need help?** Let me know your Publisher ID once you have it and I'll verify everything is set up correctly!
