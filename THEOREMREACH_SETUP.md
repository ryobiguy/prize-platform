# 📊 TheoremReach Surveys - Setup Guide

## ✅ Integration Complete!

Your TheoremReach surveys integration is ready to go. Here's what you need to activate it:

---

## 🎯 What You Need From TheoremReach

### Step 1: Get Your API Key

After signing up at https://theoremreach.com/:

1. Log in to your TheoremReach dashboard
2. Go to **"Apps"** → **"Add New App"**
3. Fill in your app details:
   - **App Name:** "Total Raffle" or "Prize Platform"
   - **Platform:** Web
   - **Category:** Rewards/Incentive
4. Copy your **API Key** (format: `xxxxxxxxxxxxxxxx`)

### Step 2: Add to .env File

Add this line to your `.env` file:

```env
# TheoremReach Surveys
REACT_APP_THEOREMREACH_API_KEY=your_api_key_here
THEOREMREACH_API_KEY=your_api_key_here
```

**Example:**
```env
REACT_APP_THEOREMREACH_API_KEY=abc123def456ghi789
THEOREMREACH_API_KEY=abc123def456ghi789
```

### Step 3: Configure Postback URL

In TheoremReach dashboard:

1. Go to **"Settings"** → **"Postback URL"**
2. Set your postback URL to:

**For Local Testing:**
```
http://localhost:5000/api/surveys/theoremreach/postback?user_id={user_id}&reward_cents={reward_cents}&transaction_id={transaction_id}&signature={signature}
```

**For Production:**
```
https://yourdomain.com/api/surveys/theoremreach/postback?user_id={user_id}&reward_cents={reward_cents}&transaction_id={transaction_id}&signature={signature}
```

3. Use the exact URL with placeholders - TheoremReach will replace them automatically

### Step 4: Restart Your Server

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## 🎮 How It Works

### User Flow:
1. User clicks **"Surveys (High Rewards!)"** tab on Tasks page
2. Clicks **"Start Surveys"** button
3. TheoremReach survey wall opens
4. User completes survey (5-15 minutes)
5. Entries are awarded automatically
6. User can take more surveys immediately

### Revenue Flow:
1. User completes survey worth $1.50
2. TheoremReach credits your account $1.50
3. User receives 300 entries (you decide conversion rate)
4. You get paid weekly/monthly by TheoremReach

---

## 💰 Entry Conversion Rate

Currently set to: **$1.00 = 200 entries**

You can adjust this in `/server/routes/surveys.js`:

```javascript
// Line 23: Convert reward to entries
const entries = Math.floor(rewardDollars * 200); // Change multiplier

// Examples:
// const entries = Math.floor(rewardDollars * 100); // $1 = 100 entries
// const entries = Math.floor(rewardDollars * 300); // $1 = 300 entries
```

**Recommendation:** Start with 200:1 ratio, adjust based on user engagement.

---

## 📊 Revenue Estimates

### Conservative (100 users/day):
- 30% complete surveys
- 1 survey per user
- Average payout: $1.50
- **Daily Revenue:** 30 × $1.50 = $45
- **Monthly Revenue:** $1,350

### Optimistic (500 users/day):
- 40% complete surveys
- 1.5 surveys per user
- Average payout: $2.00
- **Daily Revenue:** 300 × $2.00 = $600
- **Monthly Revenue:** $18,000

---

## 🎯 Combined Revenue (TheoremReach + AdGate)

With both systems active:

| Source | Daily Revenue | Monthly Revenue |
|--------|--------------|-----------------|
| TheoremReach Surveys | $45-600 | $1,350-18,000 |
| AdGate Offer Wall | $22-200 | $675-6,000 |
| **Total** | **$67-800** | **$2,025-24,000** |

---

## 🧪 Testing Checklist

- [ ] API key added to .env (both REACT_APP_ and regular)
- [ ] Postback URL configured in TheoremReach
- [ ] Server restarted
- [ ] "Surveys" tab appears on Tasks page
- [ ] "Start Surveys" button works
- [ ] Survey wall opens
- [ ] Test survey completed
- [ ] Entries awarded automatically
- [ ] User stats updated

---

## 🚨 Troubleshooting

### Survey Wall Not Opening?
- Check `.env` has `REACT_APP_THEOREMREACH_API_KEY`
- Restart React dev server (`npm run client`)
- Check browser console for errors
- Verify API key is correct

### Surveys Complete But No Entries?
- Check postback URL is correct in TheoremReach
- Check server logs for postback errors
- Verify API key matches in both places
- Check user ID is being passed correctly

### "No Surveys Available"?
- Normal - depends on user demographics
- Try different location/age in profile
- Check back at different times
- Typically 30-70% of users have surveys

---

## 💡 Pro Tips

### Maximize Survey Availability:
1. Encourage users to complete their profile
2. Better demographics = more surveys
3. Peak times: evenings and weekends
4. International users may have different availability

### Optimize Conversion:
1. Highlight high entry rewards
2. Show "High Value" badge on survey tab
3. Send notifications when surveys available
4. Limit to 2-3 surveys per day to avoid fatigue

### Monitor Performance:
1. Track completion rates
2. Monitor average revenue per user
3. A/B test entry rewards
4. Adjust multiplier based on engagement

---

## 🎉 You're Ready!

Once you add your API key, users can:
- ✅ Complete surveys for high rewards
- ✅ Earn 200-800 entries per survey
- ✅ Take unlimited surveys daily
- ✅ Choose between surveys and offer wall

**You earn $0.50-$4 per survey, users earn entries - everyone wins!**

---

## 📞 Need Help?

- **TheoremReach Dashboard:** https://theoremreach.com/dashboard
- **Documentation:** https://theoremreach.com/docs
- **Support:** support@theoremreach.com

---

**Next Step:** Once you get your API key from TheoremReach, paste it here and I'll add it to your .env file!
