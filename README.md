<div align="center">
  <img src="https://via.placeholder.com/150x150/6C63FF/FFFFFF?text=SENO" alt="SENO Studio Logo" width="120" />
  <h1>SENO Studio Discord Bot</h1>
  <p><em>The ultimate all-in-one Discord operating system for digital agencies.</em></p>
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</div>

---

## 🌟 Overview
The SENO Studio Bot transforms a standard Discord server into a highly professional, automated agency headquarters. From locking down the server to unverified users, to generating NDAs, invoices, and managing client support tickets, this bot automates the entire client lifecycle.

## ✨ Core Features

### 🛡️ Security & Onboarding
- **Automated Verification Gateway:** New users are isolated in a `#verify` channel. Upon clicking the interactive verification button, they are granted the `Member` role, instantly revealing the rest of the server.
- **Advanced 3-Strike Automod:** A ruthless zero-tolerance moderation engine. It detects English/Hinglish curse words, unauthorized links, and GIFs. It deletes the message, issues a warning in the database, and automatically kicks the user on their 3rd strike!
- **Admin Moderation Tools:** Integrated slash commands for `/kick`, `/ban`, `/warn`, `/purge`, and `/timeout`.

### 💼 Agency & Sales Operations
- **Interactive Portfolio (`/portfolio`):** A beautiful, button-driven embed showcasing SENO Studio's work across Web, Bots, and Marketing. Fully configurable via `config.json` without touching code!
- **Automated Invoicing (`/invoice`):** Instantly drop professional invoices in chat. It auto-generates a **Live QR Code** directly from your UPI ID so clients can just scan and pay.
- **Contract & NDA Generator (`/contract`):** Generate a standard Service Agreement/NDA right into a client's ticket channel with a simple command.
- **Custom Pitch Generator (`/pitch`):** Generate targeted, high-conversion pitching messages (in English/Hinglish) for cold outreach based on the client's industry!
- **Client Ticketing System (`/ticket-setup`):** Deploy a "Request a Quote" button. When clicked, it opens a private text channel visible only to the client and the Founders, capturing Project Type, Budget, and Details.

### 🛠️ Internal Team Workflows
- **Idea Bank (`/save-idea` & `/ideas`):** A centralized database for your marketing team to save inspiration, social media trends, and links on the fly. Review them all during your weekly meetings with one command.
- **Daily Standups (`/standup`):** Team members can log what they did yesterday, what they are doing today, and any blockers. The bot records this in SQLite and broadcasts it to the team channel.
- **Focus Mode (`/focus`):** Mute pings globally. If someone tags you while you are in focus mode, the bot will automatically reply and tell them not to disturb you.
- **Role Assignment Panels (`/role-setup`):** Drop interactive panels for developers, designers, and clients to self-assign their roles.

## 🚀 Setup Instructions

1. **Install Dependencies**
   Navigate to the `/bot` directory and run:
   ```bash
   cd bot
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `/bot` directory and add your credentials:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   GUILD_ID=your_server_id_here
   ```

3. **Configure the Bot (`config.json`)**
   Open `bot/src/config.json`. This is the brain of your agency operations. 
   - Enter your **UPI ID** in the payments section (the bot will auto-generate the QR code).
   - Add your portfolio links (Title, URL, Description) into the `portfolio` arrays.
   - Enter your Role IDs and Channel IDs so the bot knows where to route tickets and logs.

4. **Enable Discord Intents**
   Go to the [Discord Developer Portal](https://discord.com/developers/applications) > Your Bot > Bot tab. Ensure the following **Privileged Gateway Intents** are toggled **ON**:
   - `SERVER MEMBERS INTENT`
   - `MESSAGE CONTENT INTENT`

5. **Start the Bot**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture
- **Language:** JavaScript (CommonJS)
- **Library:** Discord.js v14
- **Database:** `better-sqlite3` (File-based, zero configuration required)
- **Deployment:** Render / PM2

---
<div align="center">
  <i>Built with ❤️ for SENO Studio.</i>
</div>
