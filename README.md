# SENO Studio - Discord Bot & Dashboard

Welcome to the SENO Studio Discord management system. This project is split into two parts:
1. **The Discord Bot** (Node.js, Discord.js, SQLite) - Manages the server, moderation, alerts, and verification.
2. **The Web Dashboard** (Next.js) - _To be built in Phase 3_, providing a web interface to configure the bot and view logs.

## 🚀 Phase 1: Core Bot Features

This directory (`/bot`) contains the Node.js Discord bot. It handles announcements, moderation (`/kick`, `/ban`, `/warn`, etc.), auto-moderation, verification onboarding, and logging.

### 📋 Prerequisites
- Node.js v18 or newer
- A Discord Bot Token and Client ID (from the [Discord Developer Portal](https://discord.com/developers/applications))

### 🛠️ Setup Instructions

1. **Install Dependencies**
   Navigate to the `/bot` directory and install the required packages:
   ```bash
   cd bot
   npm install
   ```

2. **Configure Environment Variables**
   Copy the provided `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, and `GUILD_ID` (your server ID).

3. **Configure IDs in `src/config.json`**
   Open `src/config.json` and fill in the relevant Discord Channel IDs and Role IDs for your server:
   - `logChannelId`: Where moderation logs and automod alerts will be sent.
   - `unverifiedRoleId`: The role given to new joins before they verify.
   - `memberRoleId`: The role given when they click the Verify button.

4. **Enable Discord Intents**
   **CRITICAL:** Go to the Discord Developer Portal > Your Bot > Bot tab. Ensure the following **Privileged Gateway Intents** are toggled **ON**:
   - `SERVER MEMBERS INTENT` (required for auto-role and logging joins/leaves)
   - `MESSAGE CONTENT INTENT` (required for auto-moderation of spam and invite links)
   *(Without these, the bot may crash or fail to function properly.)*

### ▶️ Running the Bot

To run the bot in development mode (auto-restarts on file changes using Node 18+ `--watch`):
```bash
npm run dev
```

To run normally:
```bash
npm start
```

### 🗄️ Architecture & Storage
- **Database**: We use `better-sqlite3` for lightweight, file-based storage. A `database.sqlite` file will be created automatically in the `/bot` directory when you start the bot. 
- **Modular Structure**: Commands are located in `src/commands/` and events in `src/events/`. Adding a new command is as simple as creating a new file in the `commands` directory.
