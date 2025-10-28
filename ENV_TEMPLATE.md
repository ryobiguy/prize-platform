# Environment Variables Template

Copy this to your `.env` file in the root directory.

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/prize-platform
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prize-platform

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com

# Twitter API (Optional - for Twitter task verification)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Unity Ads (For Video Ads)
REACT_APP_UNITY_GAME_ID=1234567
REACT_APP_UNITY_PLACEMENT_ID=rewardedVideo
REACT_APP_UNITY_TEST_MODE=true

# AdGate Media (When approved)
ADGATE_WALL_ID=your_wall_id
ADGATE_API_KEY=your_api_key

# SendGrid (For Email Notifications - Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yoursite.com

# Pollfish (Optional - for Surveys)
POLLFISH_API_KEY=your_pollfish_api_key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

## How to Set Up

### 1. Required (Minimum to Run)
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication security

### 2. For Video Ads (Unity Ads)
1. Sign up at https://dashboard.unity3d.com/
2. Create a project and select "WebGL"
3. Copy your Game ID
4. Add to `.env`:
   ```
   REACT_APP_UNITY_GAME_ID=YOUR_GAME_ID
   REACT_APP_UNITY_TEST_MODE=true
   ```

### 3. For AdGate Media (When Approved)
1. Get credentials from AdGate Media dashboard
2. Add to `.env`:
   ```
   ADGATE_WALL_ID=your_wall_id
   ADGATE_API_KEY=your_api_key
   ```

### 4. For Email Notifications (Optional)
1. Sign up at https://sendgrid.com/
2. Create API key
3. Verify sender email
4. Add to `.env`:
   ```
   SENDGRID_API_KEY=your_key
   SENDGRID_FROM_EMAIL=your_email
   ```

## Quick Start

1. Copy this template to `.env` file:
   ```bash
   # On Windows PowerShell:
   Copy-Item ENV_TEMPLATE.md .env
   
   # Then edit .env and add your values
   ```

2. At minimum, set these:
   - `MONGODB_URI`
   - `JWT_SECRET`

3. Run the app:
   ```bash
   npm run dev
   ```

## Testing Unity Ads

With `REACT_APP_UNITY_TEST_MODE=true`, you'll see test ads immediately.
Once you're ready for production, set it to `false` to show real ads.
