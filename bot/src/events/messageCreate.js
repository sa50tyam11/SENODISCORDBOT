const { Events } = require('discord.js');
const config = require('../config.json');
const { sendLog } = require('../utils/logger');
const AutomodStrike = require('../database/models/AutomodStrike');

// Basic spam tracking: user ID -> array of message timestamps
const userMessages = new Map();
const SPAM_THRESHOLD = 5; // 5 messages
const SPAM_WINDOW = 5000; // in 5 seconds

async function handleStrike(message, client, reason) {
  try {
    let strikeRecord = await AutomodStrike.findOne({ userId: message.author.id, guildId: message.guild.id });
    if (!strikeRecord) {
      strikeRecord = new AutomodStrike({ userId: message.author.id, guildId: message.guild.id });
    }
    
    strikeRecord.strikes += 1;
    strikeRecord.reasons.push(reason);
    await strikeRecord.save();

    if (strikeRecord.strikes >= 3) {
      // 3 strikes -> Kick!
      await message.member.kick('Reached 3 Automod Strikes');
      await message.channel.send(`🚨 <@${message.author.id}> has been automatically kicked from the server for reaching 3 automod strikes.`);
      await sendLog(client, 'Automod: Kicked (3 Strikes)', `Kicked <@${message.author.id}>.\n**Reasons:**\n${strikeRecord.reasons.join('\\n')}`, '#FF0000');
      // Reset strikes after kick so if they rejoin they start fresh
      await AutomodStrike.deleteOne({ userId: message.author.id, guildId: message.guild.id });
    } else {
      // Just warn
      await message.channel.send(`⚠️ <@${message.author.id}>, Warning (${strikeRecord.strikes}/3): ${reason}`).then(m => setTimeout(() => m.delete().catch(() => {}), 8000));
      await sendLog(client, `Automod: Strike ${strikeRecord.strikes}/3`, `Warned <@${message.author.id}> in ${message.channel}\n**Reason:** ${reason}`, '#FFA500');
    }
  } catch (error) {
    console.error('Error handling strike:', error);
  }
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    // ==========================================
    // NON-AUTOMOD FEATURES (Runs for everyone)
    // ==========================================

    // 1. Focus Mode Check
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

    // 2. Help Desk Auto-Responder
    const helpDeskChannelId = '1470824084513226940';
    const helperRoleId = '1470824083393347840';

    if (message.channel.id === helpDeskChannelId && message.mentions.roles.has(helperRoleId)) {
      const EmbedBuilder = require('discord.js').EmbedBuilder;
      const embed = new EmbedBuilder()
        .setTitle('🛠️ Request Received')
        .setDescription(`Hello <@${message.author.id}>!\n\nThank you for reaching out. A <@&${helperRoleId}> has been notified and will be with you shortly to help resolve your issue.\n\nPlease ensure you have provided as much detail as possible in your message so we can assist you quickly!`)
        .setColor('#2F3136')
        .setFooter({ text: 'SENO Studio Support' })
        .setTimestamp();
      
      await message.reply({ embeds: [embed] });
    }

    // ==========================================
    // AUTOMOD FEATURES (Bypassed for Admins)
    // ==========================================

    // Admin bypass for automod (can be tweaked based on roles)
    if (message.member.permissions.has('Administrator')) return;

    const content = message.content.toLowerCase();
    const automodConfig = config.automod || {};

    // 3. Check Banned Words
    const bannedWords = automodConfig.bannedWords || [];
    for (const word of bannedWords) {
      if (content.includes(word)) {
        await message.delete().catch(() => {});
        await handleStrike(message, client, `Used a prohibited word (${word})`);
        return;
      }
    }

    // 4. Check GIFs
    if (automodConfig.blockGifs) {
      const hasGifLink = content.includes('tenor.com') || content.includes('giphy.com');
      const hasGifAttachment = message.attachments.some(a => a.contentType && a.contentType.includes('gif'));
      if (hasGifLink || hasGifAttachment) {
        await message.delete().catch(() => {});
        await handleStrike(message, client, 'Posted a GIF');
        return;
      }
    }

    // 5. Check Links
    if (automodConfig.blockAllLinks) {
      const linkRegex = /(https?:\/\/[^\s]+)/g;
      if (linkRegex.test(content)) {
        await message.delete().catch(() => {});
        await handleStrike(message, client, 'Posted an unauthorized link');
        return;
      }
    } else if (automodConfig.inviteLinkRegex) {
      // Fallback to just discord invites if all links aren't blocked
      const inviteRegex = new RegExp(automodConfig.inviteLinkRegex, 'i');
      if (inviteRegex.test(content)) {
        await message.delete().catch(() => {});
        await handleStrike(message, client, 'Posted a Discord invite link');
        return;
      }
    }

    // 6. Spam Detection
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
      await message.delete().catch(() => {}); 
      await handleStrike(message, client, 'Spamming the chat');
      userMessages.delete(message.author.id); // Clear history to prevent multiple strikes at once
    }
  },
};
