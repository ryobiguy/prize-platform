# 🎯 Prize Draw System - Complete Guide

## Overview
Your prize platform now has a complete draw system with profitability controls:
- **Weekly draws every Friday at 8 PM**
- **Minimum entries required** before drawing (ensures profitability)
- **Automatic validation** prevents unprofitable draws

---

## 📊 How Minimum Entries Work

### Profitability Calculation

**Example: £500 Cash Prize**
- Minimum entries: 100
- Entry cost: 1 entry per user
- Average entries per user: 10
- Average revenue per user: £0.77 (from tasks/ads)

**Revenue Calculation:**
- 100 entries ÷ 10 entries/user = 10 users minimum
- 10 users × £0.77 = £7.70 revenue
- **Not profitable yet!**

**Better Model:**
- Set minimum to 100 entries
- With 20 active users completing tasks
- 20 users × £0.77 = £15.40 revenue
- Prize cost: £500
- **You need ~650 users or adjust minimum entries**

### Recommended Minimum Entries

| Prize Value | Minimum Entries | Estimated Users Needed | Break-even Revenue |
|-------------|----------------|----------------------|-------------------|
| £50         | 30             | 15-20 users          | £11.55-£15.40     |
| £100        | 50             | 25-35 users          | £19.25-£26.95     |
| £250        | 75             | 40-50 users          | £30.80-£38.50     |
| £500        | 100            | 60-80 users          | £46.20-£61.60     |

**Note:** These are conservative estimates. Adjust based on your actual user engagement and task completion rates.

---

## 🗓️ Weekly Draw Schedule

### Default: Every Friday at 8 PM

**Timeline:**
- **Monday-Thursday**: Users complete tasks and enter draws
- **Friday 8 PM**: Prize draw closes
- **Friday 8-9 PM**: Admin draws winners
- **Friday-Sunday**: Winners notified
- **Monday**: New prize week begins

### How to Set Draw Dates

When creating a prize, the system automatically:
1. Sets `drawDay` to "Friday"
2. Sets `endDate` to next Friday at 8 PM
3. Requires minimum entries before drawing

---

## 🎮 Using the System

### For Admins

#### 1. Update Existing Prizes
Run this script to update all prizes with Friday draws and minimum entries:
```bash
node updatePrizeSettings.js
```

This will:
- Set all prizes to draw on Friday
- Add minimum entry requirements based on value
- Set end dates to next Friday

#### 2. Check Ready Prizes
1. Go to `/admin`
2. Click **"Draw Winners"** tab
3. See prizes with:
   - ✅ Green progress bar = Ready to draw
   - 🟡 Yellow progress bar = Not enough entries yet
   - Entry count and minimum requirement

#### 3. Draw Winners
- Button is **disabled** until minimum entries met
- Click **"Draw Winner"** when ready
- System validates minimum before drawing
- Winners selected fairly and randomly

### For Users

Users see:
- Prize end date (Friday)
- Current entry count
- Their own entries
- Time remaining

---

## 💰 Profitability Controls

### Automatic Checks

The system prevents unprofitable draws:

```javascript
// Backend validation
if (prize.totalEntries < prize.minimumEntries) {
  return error: "Minimum 50 entries required. Currently has 10 entries."
}
```

### Admin Panel Shows:
- Current entries vs minimum required
- Progress bar (green when ready)
- Disabled draw button until minimum met
- Clear messaging about requirements

---

## 🔧 Configuration

### Adjust Minimum Entries

**Option 1: In MongoDB**
1. Open MongoDB Compass
2. Find the prize
3. Edit `minimumEntries` field
4. Save

**Option 2: When Creating Prize**
Set `minimumEntries` in the prize document:
```javascript
{
  title: "£100 Cash Prize",
  value: 100,
  minimumEntries: 50,  // Adjust this
  drawDay: "Friday"
}
```

### Change Draw Day

Default is Friday, but you can change to any day:
```javascript
{
  drawDay: "Friday"  // or Monday, Tuesday, etc.
}
```

---

## 📈 Recommended Strategy

### Phase 1: Launch (Weeks 1-4)
- **Lower minimums** to build excitement
- £50 prizes with 20-30 minimum entries
- Focus on user acquisition
- May run at a loss initially

### Phase 2: Growth (Weeks 5-12)
- **Increase minimums** gradually
- £100-250 prizes with 50-75 entries
- Balance profitability with user growth
- Monitor revenue per user

### Phase 3: Profitable (Week 13+)
- **Full minimums** for profitability
- £500+ prizes with 100+ entries
- Sustainable business model
- Scale up prize values

---

## 🎯 Key Features

✅ **Minimum Entries Enforcement**
- Backend validation
- Frontend visual indicators
- Disabled draw button
- Clear error messages

✅ **Friday Draw Schedule**
- Automatic end date calculation
- Consistent weekly rhythm
- User expectations set

✅ **Profitability Protection**
- Can't draw unprofitable prizes
- Admin sees entry requirements
- Progress tracking

✅ **Fair Winner Selection**
- Weighted random selection
- No duplicate winners
- Transparent process

---

## 🚀 Next Steps

1. **Run the update script:**
   ```bash
   node updatePrizeSettings.js
   ```

2. **Check your admin panel:**
   - Go to `/admin`
   - View updated prizes
   - See minimum entry requirements

3. **Adjust minimums** based on your:
   - User acquisition rate
   - Task completion rate
   - Revenue per user
   - Business goals

4. **Monitor and optimize:**
   - Track entries per prize
   - Adjust minimums as needed
   - Balance growth vs profitability

---

## 💡 Pro Tips

1. **Start Conservative**: Set higher minimums initially, lower them if needed
2. **Communicate Clearly**: Tell users about minimum entry requirements
3. **Create Urgency**: "Only 20 more entries needed for Friday's draw!"
4. **Multiple Prizes**: Run several prizes with different minimums
5. **Track Metrics**: Monitor revenue per user to optimize minimums

---

**Questions? Check the admin panel or adjust settings in MongoDB!**
