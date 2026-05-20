# Real Roleplay - Final MySQL + Discord Project

## Features
- Next.js App Router
- Discord login with NextAuth
- MySQL whitelist storage
- Discord webhook embed on application submit
- Discord button interactions: Approve / Review / Reject
- Admin dashboard at `/admin`
- GTA-inspired cinematic UI with whitelist-first funnel

## Setup
1. Copy `.env.example` to `.env.local`
2. Fill in Discord OAuth, webhook, public key, MySQL credentials
3. Import `schema.sql` into HeidiSQL / MySQL
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run locally:
   ```bash
   npm run dev
   ```

## Discord configuration
In the Discord Developer Portal:
- OAuth redirect URL:
  `http://localhost:3000/api/auth/callback/discord`
- Interactions endpoint URL:
  `https://your-domain.com/api/discord/interactions`

## Production note
This project is ready for a real MySQL database. Staff can review in `/admin` and/or directly from Discord message buttons.
