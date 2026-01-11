# XO Game - Tic-Tac-Toe with OAuth 2.0

A full-stack web application built with Next.js and Express that brings the classic Tic-Tac-Toe game to life with modern authentication and a competitive scoring system.

## What's Inside

This project implements:
- OAuth 2.0 authentication via Auth0
- Smart AI opponent using minimax algorithm
- Scoring system with win streaks and bonus points
- Admin dashboard for viewing player rankings
- Real-time statistics tracking
- Responsive UI with Tailwind CSS

## Technology Stack

**Frontend**
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Auth0 Next.js SDK

**Backend**
- Node.js & Express
- JSON file storage
- Auth0 JWT authentication

## Getting Started

You'll need Node.js v18+ and an Auth0 account.

### Setting Up Auth0

1. Head to [Auth0](https://manage.auth0.com/) and create an account
2. Create a new Regular Web Application
3. Create an API with identifier `https://xo-game-api`
4. Save your Domain, Client ID, and Client Secret

In your Auth0 application settings, configure:
- Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
- Allowed Logout URLs: `http://localhost:3000`
- Allowed Web Origins: `http://localhost:3000`

### Installing Dependencies

```bash
cd server
npm install

cd ../client
npm install --legacy-peer-deps
```

### Configuration

**Backend** - Create `server/.env`:
```env
PORT=5000
AUTH0_AUDIENCE=https://xo-game-api
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
```

**Frontend** - Create `client/.env.local`:

First generate a secret:
```bash
openssl rand -hex 32
```

Then create the file:
```env
AUTH0_SECRET='your-generated-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
AUTH0_AUDIENCE='https://xo-game-api'
NEXT_PUBLIC_API_URL='http://localhost:5000'
```

### Running the Application

Start both servers:

```bash
cd server
npm start

cd ../client
npm run dev
```

Visit `http://localhost:3000` to play!

## How It Works

**Gameplay**
- You're X (blue), the bot is O (red)
- Click any empty cell to make your move
- The bot responds immediately using optimal strategy

**Scoring Rules**
- Win: +1 point
- Loss: -1 point
- Three wins in a row: +1 bonus point, then streak resets
- Draw: no point change, streak continues

Click "View All Scores" to see the leaderboard.

## API Reference

All endpoints require Auth0 JWT authentication.

**User Endpoints**
- `POST /api/user/profile` - Create or retrieve user profile
- `GET /api/user/score` - Get current score

**Game Endpoints**
- `POST /api/game/move` - Submit a move
  - Request: `{ board: Cell[], position: number }`
  - Response: Updated board state, winner, bot move, score changes

**Admin Endpoints**
- `GET /api/admin/scores` - Retrieve all player scores

## Project Structure

```
xo-test/
├── client/
│   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── package.json
├── server/
│   ├── database.js
│   ├── gameLogic.js
│   ├── index.js
│   └── package.json
└── README.md
```

## The AI

The bot uses the minimax algorithm to evaluate all possible game states and choose the optimal move. This makes it nearly unbeatable - your best outcome is typically a draw unless you play perfectly.

## Troubleshooting

**Can't log in?**
Double-check your Auth0 callback URLs and environment variables.

**Database issues?**
Delete `server/database.json` and restart the server.

**CORS errors?**
Make sure the backend is running on port 5000 and `NEXT_PUBLIC_API_URL` is correct.

## License

MIT
