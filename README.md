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


## Admin whitelist access

Có 2 cách cấp quyền vào trang `/admin`:

1. Theo Discord user ID:

```env
ALLOWED_ADMIN_IDS=123456789012345678,987654321098765432
```

2. Theo Discord role ID:

```env
DISCORD_GUILD_ID=your_discord_server_id
DISCORD_BOT_TOKEN=your_bot_token
ADMIN_ROLE_IDS=111111111111111111,222222222222222222
```

Embed whitelist vẫn giữ phần tiểu sử rút gọn như cũ và có thêm nút/link **Xem đầy đủ** trỏ về `/admin#application-ID` để staff đọc full tiểu sử trên dashboard.
