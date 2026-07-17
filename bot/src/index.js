require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('./database/db');

// Connect to Database
connectDB();

// Create a new client instance with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Collections for commands
client.commands = new Collection();

// Load Handlers
const handlersPath = path.join(__dirname, 'handlers');
const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

for (const file of handlerFiles) {
  require(path.join(handlersPath, file))(client);
}

// Load Modules
client.once('ready', () => {
  const { initUptimeMonitor } = require('./modules/uptimeMonitor');
  initUptimeMonitor(client);

  const { initWebhookServer } = require('./modules/githubWebhook');
  initWebhookServer(client);

  const { initStandupCron } = require('./modules/standup');
  initStandupCron(client);
});

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
