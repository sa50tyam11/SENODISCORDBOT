const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: Events.MessageDelete,
  async execute(message, client) {
    if (!message.author || message.author.bot) return; // Ignore bots and uncached authors
    if (!message.guild) return; // Ignore DMs

    await sendLog(
      client,
      'Message Deleted',
      `**Author:** <@${message.author.id}>\n**Channel:** ${message.channel}\n**Content:** ${message.content || '[No Text/Embed/Attachment]'}`,
      '#FF5555'
    );
  },
};
