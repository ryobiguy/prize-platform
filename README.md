# Total Raffle

A full-stack web application where users complete simple tasks (social media follows, watching ads, etc.) to earn entries and win prizes.

## Features

- **User Authentication**: 
  - Google Sign-In (OAuth 2.0)
  - Apple Sign-In
  - Secure JWT-based tokens
- **Task System**: Complete tasks to earn entries
  - Twitter follow/retweet/like
  - Watch advertisements
  - Daily login rewards
  - Automatic verification
- **Prize System**: Enter prize draws with earned entries
  - Multiple prize types (physical items, gift cards, cash)
  - Countdown timers
  - Fair random winner selection
- **User Dashboard**: Track entries, prizes, and activity
- **Admin Panel**: Manage prizes, tasks, and draw winners

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Twitter API integration

### Frontend
- React 18
- React Router
- Axios
- Lucide React (icons)
- React Hot Toast (notifications)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Twitter API credentials (optional, for task verification)

### Installation

1. **Install dependencies**:
```bash
npm run install-all
```

2. **Set up environment variables**:
Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prize-platform
JWT_SECRET=your_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
TWITTER_BEARER_TOKEN=your_twitter_token
```

**Important**: To enable Google/Apple Sign-In, follow the setup guide in `OAUTH_SETUP.md`

3. **Start MongoDB**:
```bash
mongod
```

4. **Run the application**:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- React frontend on http://localhost:3000

## Project Structure

```
prize-platform/
├── server/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── services/        # External services (Twitter API)
│   └── index.js         # Server entry point
├── client/
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── context/     # React context (Auth)
│       └── App.js       # Main app component
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Prizes
- `GET /api/prizes` - Get all active prizes
- `GET /api/prizes/:id` - Get single prize
- `POST /api/prizes/:id/enter` - Enter a prize draw

### Tasks
- `GET /api/tasks` - Get all available tasks
- `POST /api/tasks/:id/complete` - Complete a task

### User
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/entries` - Get user's prize entries
- `GET /api/users/wins` - Get user's wins

### Admin
- `POST /api/admin/prizes` - Create prize
- `POST /api/admin/tasks` - Create task
- `POST /api/admin/prizes/:id/draw` - Draw winners

## Features to Add

- Email notifications for winners
- Payment integration for prize fulfillment
- More social media platforms (Instagram, YouTube)
- Referral system
- Leaderboards
- Prize history and statistics

## License

MIT
