# Rialo Community Card v2

A fresh Next.js project for a fun Rialo community identity card.

## Features

- Enter X/Twitter username
- Fetch profile information through an API route
- Uses official X API when `X_BEARER_TOKEN` is configured
- Public avatar fallback for demo mode
- Select your own Discord/community roles
- Generate an identity card
- Download card as PNG
- Share card text on X
- Rialo logo included
- Created By @joydeepcontai (Knight-rialo)

## Run in VS Code

```powershell
npm install
npm run dev
```

Open http://localhost:3000

## Optional X API setup

Copy `.env.example` to `.env.local` and add your X API Bearer Token:

```env
X_BEARER_TOKEN=your_token_here
```

The fallback avatar service is not an official X API. For a production site, use the official X API and keep the token server-side.

## Important

Discord roles are self-selected in this version. They are not verified against a Discord server.
