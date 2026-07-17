const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

async function sendLog(client, title, description, color = '#2b2d31') {
  const logChannelId = config.channels.logChannelId;
  if (!logChannelId) return;

  try {
    const channel = await client.channels.fetch(logChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Failed to send log:', error);
  }
}

module.exports = { sendLog };
