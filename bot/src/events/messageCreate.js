const { Events } = require('discord.js');
const config = require('../config.json');
const { sendLog } = require('../utils/logger');

// Basic spam tracking: user ID -> array of message timestamps
const userMessages = new Map();
const SPAM_THRESHOLD = 5; // 5 messages
const SPAM_WINDOW = 5000; // in 5 seconds

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    // Admin bypass for automod (can be tweaked based on roles)
    if (message.member.permissions.has('Administrator')) return;

    const content = message.content.toLowerCase();

    // 1. Check Banned Words
    const bannedWords = config.automod.bannedWords || [];
    for (const word of bannedWords) {
      if (content.includes(word)) {
        await message.delete();
        await message.channel.send(`<@${message.author.id}>, your message contained a banned word and was removed.`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        await sendLog(client, 'Automod: Banned Word', `Deleted message from <@${message.author.id}> in ${message.channel}\n**Word:** ${word}`, '#FF0000');
        return;
      }
    }

    // 2. Check Invite Links
    const inviteRegex = new RegExp(config.automod.inviteLinkRegex, 'i');
    if (inviteRegex.test(content)) {
      await message.delete();
      await message.channel.send(`<@${message.author.id}>, please do not post invite links.`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
      await sendLog(client, 'Automod: Invite Link', `Deleted invite link from <@${message.author.id}> in ${message.channel}`, '#FF0000');
      return;
    }

    // 3. Spam Detection
    const now = Date.now();
    if (!userMessages.has(message.author.id)) {
      userMessages.set(message.author.id, []);
    }
    
    const timestamps = userMessages.get(message.author.id);
    timestamps.push(now);
    
    // Clean up old timestamps
    while (timestamps.length > 0 && now - timestamps[0] > SPAM_WINDOW) {
      timestamps.shift();
    }

    if (timestamps.length >= SPAM_THRESHOLD) {
      // Possible spam
      await message.delete().catch(() => {}); // Attempt to delete the trigger message
      
      try {
        // Timeout the user for 5 minutes
        await message.member.timeout(5 * 60 * 1000, 'Automod: Spamming');
        await message.channel.send(`<@${message.author.id}> has been timed out for 5 minutes for spamming.`);
        await sendLog(client, 'Automod: Spam', `Timed out <@${message.author.id}> for spamming in ${message.channel}`, '#FF0000');
      } catch (err) {
        console.error('Failed to timeout user for spam:', err);
      }
      
      // Clear their history so we don't keep timing them out on the same burst
      userMessages.delete(message.author.id);
    }

    // 4. Focus Mode Check
    if (message.mentions.users.size > 0) {
      const FocusMode = require('../database/models/FocusMode');
      for (const [id, mentionedUser] of message.mentions.users) {
        if (id === message.author.id) continue;
        
        try {
          const row = await FocusMode.findOne({ userId: id });

          if (row) {
            const expires = new Date(row.expiresAt);
            if (expires > new Date()) {
              // User is currently focused
              await message.reply({ content: `Shh! <@${id}> is currently in **Focus Mode** until <t:${Math.floor(expires.getTime() / 1000)}:t>. Please do not disturb them unless it's urgent.` });
            } else {
              // Expired, clean it up
              await FocusMode.deleteOne({ userId: id });
            }
          }
        } catch (err) {
          console.error('Focus mode check error:', err);
        }
      }
    }
  },
};
