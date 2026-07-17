const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage, client) {
    if (!newMessage.author || newMessage.author.bot) return;
    if (!newMessage.guild) return;
    if (oldMessage.content === newMessage.content) return; // Might be an embed load

    await sendLog(
      client,
      'Message Edited',
      `**Author:** <@${newMessage.author.id}>\n**Channel:** ${newMessage.channel}\n\n**Before:** ${oldMessage.content || '[Empty]'}\n**After:** ${newMessage.content || '[Empty]'}`,
      '#FFAA00' // Orange/Yellow
    );
  },
};
