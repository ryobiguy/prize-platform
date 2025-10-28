# 🏆 Winner Selection System Documentation

## Overview

The Prize Platform includes a fully automated winner selection system that:
- ✅ Automatically draws winners when prizes end
- ✅ Sends email notifications to winners
- ✅ Prevents duplicate winners
- ✅ Respects minimum entry requirements
- ✅ Provides admin controls and monitoring

---

## 🎯 How It Works

### Automated Scheduler

The system runs two automated jobs:

1. **Hourly Prize Check** (Every hour at :00)
   - Scans all prizes that have ended
   - Checks if minimum entry requirements are met
   - **Checks if today is the designated draw day** (e.g., Friday)
   - Automatically draws winners on the correct day
   - Sends email notifications

2. **Daily Status Update** (Every day at midnight)
   - Updates prize statuses (upcoming → active → ended → drawn)
   - Cleans up old data
   - Maintains database integrity

### Draw Day Logic

Each prize has a `drawDay` field (e.g., "Friday"). The system will:
- ✅ Wait until the specified day to draw winners
- ✅ Only draw if minimum entries are met
- ✅ Only draw if the prize has ended
- ⚠️ Prizes wait for their draw day even if they ended earlier in the week

**Example:**
- Prize ends on Tuesday
- Draw day is Friday
- System checks hourly but waits until Friday
- On Friday, winners are drawn automatically

### Winner Selection Algorithm

```javascript
1. Create weighted pool of entries
   - Each user's entries are added to the pool
   - More entries = higher chance of winning
   
2. Draw winners (no duplicates)
   - Randomly select from the pool
   - Remove selected user from pool
   - Repeat until all winners are drawn
   
3. Update database
   - Save winners to prize
   - Update user's win history
   - Mark prize as "drawn"
   
4. Send notifications
   - Email each winner
   - Mark as notified
   - Send admin summary
```

### Automatic Flow:

1. Prize ends
   ↓
2. Hourly scheduler checks
   ↓
3. Minimum entries met?
   ↓ YES
4. Is today the draw day? (e.g., Friday)
   ↓ YES
5. Draw winners (weighted random)
   ↓
6. Save to database
   ↓
7. Send email notifications
   ↓
8. Mark as notified
   ↓
9. Update prize status to "drawn"

**Note:** If it's not the draw day yet, the system waits and checks again next hour.

---

## 📧 Email Notifications

### Winner Email

Winners receive a beautifully formatted email with:
- 🎉 Congratulations message
- 💰 Prize details (title, value, description)
- 📋 Next steps to claim the prize
- 🔗 Link to their dashboard

### Development Mode

Without SendGrid API key:
- Emails are logged to the console
- All functionality works normally
- Perfect for testing

### Production Mode

With SendGrid API key configured:
- Real emails are sent via SendGrid
- Professional HTML templates
- Delivery tracking

---

## 🛠️ Setup Instructions

### 1. Install Dependencies

Already included in `package.json`:
```bash
npm install
```

Dependencies:
- `nodemailer` - Email sending
- `node-cron` - Scheduled tasks

### 2. Configure Email Service (Optional)

Add to `.env`:
```env
# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yoursite.com
ADMIN_EMAIL=admin@yoursite.com

# Client URL for email links
CLIENT_URL=https://yoursite.com
```

**Get SendGrid API Key:**
1. Sign up at https://sendgrid.com/
2. Go to Settings → API Keys
3. Create new API key with "Mail Send" permissions
4. Copy and paste into `.env`

### 3. System Starts Automatically

The scheduler starts when the server starts:
```bash
npm run dev
```

You'll see:
```
✅ MongoDB Connected
🎯 Prize Draw Scheduler started
⏰ Running hourly prize draw check...
```

---

## 🎮 Admin Controls

### Admin Panel → Settings Tab

**Test Email Service**
- Send test email to verify configuration
- Works in both dev and production modes
- Confirms email delivery

**Trigger Draw Check**
- Manually run the automated check
- Useful for testing or immediate draws
- Same logic as automated scheduler

**Scheduler Status**
- View current scheduler state
- Check if jobs are running
- Monitor email notifications

### Admin Panel → Draw Winners Tab

**Manual Prize Draw**
- View prizes ready for drawing
- See entry counts and progress
- Draw winners with one click
- Automatic email notifications

**Requirements Check**
- Shows minimum entry requirements
- Progress bar visualization
- Prevents drawing if minimum not met

---

## 📊 Database Schema

### Prize Model - Winners Array

```javascript
winners: [{
  user: ObjectId,           // Reference to User
  drawnAt: Date,            // When winner was selected
  notified: Boolean         // Email sent successfully
}]
```

### User Model - Wins Array

```javascript
wins: [{
  prize: ObjectId,          // Reference to Prize
  wonAt: Date,              // When user won
  claimed: Boolean          // Prize claimed status
}]
```

---

## 🔄 Prize Status Flow

```
upcoming → active → ended → drawn
    ↓         ↓        ↓       ↓
  Before   During   After   Winners
  start    draw     draw    selected
```

**Status Updates:**
- `upcoming` - Before start date
- `active` - Between start and end date
- `ended` - After end date, no winners yet
- `drawn` - Winners have been selected

---

## 🧪 Testing the System

### 1. Create a Test Prize

```javascript
// In MongoDB or via Admin Panel
{
  title: "Test Prize",
  value: 50,
  type: "giftcard",
  startDate: new Date(),
  endDate: new Date(Date.now() + 60000), // 1 minute from now
  minimumEntries: 5,
  totalWinners: 1
}
```

### 2. Add Test Entries

- Create test users
- Have them enter the prize
- Ensure minimum entries are met

### 3. Wait for Draw

**Option A: Wait for scheduler (1 hour)**
- Prize will be drawn automatically
- Check console for logs

**Option B: Manual trigger**
- Go to Admin Panel → Settings
- Click "Trigger Draw Check Now"
- Instant results

### 4. Verify Results

Check:
- ✅ Winner selected in database
- ✅ Email sent (console or inbox)
- ✅ Prize status = "drawn"
- ✅ User's wins array updated

---

## 🚨 Troubleshooting

### No Winners Being Drawn

**Check:**
1. Prize end date has passed
2. Minimum entries requirement met
3. Prize doesn't already have winners
4. Scheduler is running (check console)

**Solution:**
```bash
# Restart server to restart scheduler
npm run dev
```

### Emails Not Sending

**Development Mode:**
- Check console for email logs
- Emails won't actually send without API key

**Production Mode:**
- Verify SendGrid API key in `.env`
- Check SendGrid dashboard for errors
- Test with Admin Panel → Settings → Test Email

### Duplicate Winners

**This shouldn't happen!** The algorithm prevents duplicates.

If it does:
1. Check the draw logic in `prizeDrawScheduler.js`
2. Verify the `selectedUserIds` Set is working
3. Report the bug with prize details

---

## 📈 Monitoring & Logs

### Console Logs

The system provides detailed logging:

```
🎯 Prize Draw Scheduler started
⏰ Running hourly prize draw check...
🎲 Found 2 prize(s) ready for drawing
🎯 Drawing winners for: £100 Amazon Gift Card
✅ Successfully drew 1 winner(s) for "£100 Amazon Gift Card"
📧 Notified winner: john_doe
✅ All winner notifications sent for "£100 Amazon Gift Card"
```

### Admin Dashboard

Monitor via Admin Panel:
- **Dashboard Tab** - Total prizes drawn, value given
- **Draw Winners Tab** - Prizes ready to draw
- **All Winners Tab** - Complete winner history
- **Settings Tab** - System status

---

## 🔐 Security Features

### Winner Selection
- Cryptographically random selection
- No bias or manipulation possible
- Transparent algorithm

### Email Security
- No hardcoded credentials
- Environment variable configuration
- Secure SMTP connection

### Admin Only
- All draw endpoints require admin auth
- JWT token validation
- Middleware protection

---

## 🎨 Customization

### Email Templates

Edit `server/services/emailService.js`:

```javascript
// Customize winner email
async sendWinnerNotification(user, prize) {
  // Modify HTML template
  // Change colors, text, layout
  // Add your branding
}
```

### Scheduler Timing

Edit `server/services/prizeDrawScheduler.js`:

```javascript
// Change from hourly to every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  await this.checkAndDrawPrizes();
});
```

### Minimum Requirements

Edit prize settings:
```javascript
minimumEntries: 50,  // Require 50 entries
totalWinners: 3,     // Select 3 winners
```

---

## 📝 API Endpoints

### Admin Only

**POST** `/api/admin/prizes/:id/draw`
- Manually draw winners for a prize
- Sends email notifications
- Returns winner details

**GET** `/api/admin/prizes/ready-to-draw`
- Get all prizes ready for drawing
- Includes entry counts and participants

**GET** `/api/admin/winners`
- Get all winners across all prizes
- Sorted by most recent

**PUT** `/api/admin/winners/:prizeId/:winnerId/notify`
- Mark winner as notified
- For manual notification tracking

**POST** `/api/admin/test-email`
- Send test email
- Verify email configuration

**POST** `/api/admin/trigger-draw-check`
- Manually trigger scheduler
- Runs full prize check

---

## 🚀 Production Checklist

Before launching:

- [ ] SendGrid API key configured
- [ ] FROM_EMAIL set to your domain
- [ ] ADMIN_EMAIL set for notifications
- [ ] CLIENT_URL set to production URL
- [ ] Test email sending works
- [ ] Test winner selection works
- [ ] Verify email templates look good
- [ ] Check scheduler is running
- [ ] Monitor logs for errors

---

## 💡 Best Practices

### Prize Configuration
- Set realistic minimum entries
- Give enough time between start and end
- Choose appropriate draw days
- Test with small prizes first

### Email Management
- Use professional FROM_EMAIL address
- Keep templates mobile-friendly
- Include clear next steps
- Provide support contact

### Monitoring
- Check logs daily
- Review winner notifications
- Monitor email delivery rates
- Track user satisfaction

### Scaling
- Scheduler handles any number of prizes
- Email sending is async (non-blocking)
- Database queries are optimized
- Can handle thousands of entries

---

## 🆘 Support

### Common Questions

**Q: When do prizes get drawn?**
A: Automatically every hour after the end date, if minimum entries are met.

**Q: Can I draw winners early?**
A: Yes, use the manual draw button in Admin Panel.

**Q: What if minimum entries aren't met?**
A: Prize won't be drawn automatically. You can lower the minimum or extend the deadline.

**Q: Can users win multiple times?**
A: Not in the same prize draw. They can win different prizes.

**Q: How do I know if emails are working?**
A: Use the Test Email feature in Settings tab.

---

## 🎉 Success!

Your winner selection system is now fully operational!

**Features:**
✅ Automated prize draws
✅ Email notifications
✅ Admin controls
✅ Fair & transparent
✅ Production ready

**Next Steps:**
1. Create your first real prize
2. Test the full flow
3. Monitor the first draw
4. Launch to users!

Good luck with your prize platform! 🚀
