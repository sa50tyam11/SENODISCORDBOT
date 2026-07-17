const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const { sendLog } = require('../utils/logger');

// Store recent join timestamps for anti-raid
const recentJoins = [];
const RAID_THRESHOLD = 5; // e.g., 5 joins
const RAID_WINDOW = 10000; // in 10 seconds

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    // 1. Auto-assign Unverified Role
    const unverifiedRoleId = config.roles.unverifiedRoleId;
    if (unverifiedRoleId) {
      try {
        await member.roles.add(unverifiedRoleId);
      } catch (err) {
        console.error('Failed to add unverified role:', err);
      }
    }

    // 2. Log Join
    await sendLog(
      client,
      'Member Joined',
      `<@${member.id}> (${member.user.tag}) joined the server.`,
      '#84cc16' // Lime Green
    );

    // 3. Anti-raid basic check
    const now = Date.now();
    recentJoins.push(now);
    
    // Clean up old entries
    while (recentJoins.length > 0 && now - recentJoins[0] > RAID_WINDOW) {
      recentJoins.shift();
    }

    if (recentJoins.length >= RAID_THRESHOLD) {
      // Possible raid detected
      await sendLog(
        client,
        '🚨 RAID DETECTED 🚨',
        `High join rate detected: ${recentJoins.length} joins in ${RAID_WINDOW/1000} seconds.`,
        '#FF0000'
      );
      // Further actions could be taken here (e.g., auto-kicking or pausing invites)
    }
  },
};
