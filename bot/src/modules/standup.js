const cron = require('node-cron');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

function initStandupCron(client) {
  // Run at 09:00 AM Monday-Friday
  cron.schedule('0 9 * * 1-5', async () => {
    const standupChannelId = config.channels.standupChannelId;
    if (!standupChannelId) return;

    try {
      const channel = await client.channels.fetch(standupChannelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle('🌅 Daily Standup')
        .setDescription('Good morning team! It is time for our daily standup. Please click the button below or type `/standup` to submit your update.')
        .setColor('#84cc16'); // Lime Green

      const button = new ButtonBuilder()
        .setCustomId('standup_prompt_btn')
        .setLabel('Submit Standup')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📝');

      const row = new ActionRowBuilder().addComponents(button);

      await channel.send({ content: '@everyone', embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Failed to send daily standup prompt:', error);
    }
  }, {
    timezone: "America/New_York" // Change as needed
  });
  
  console.log('Standup cron job scheduled for 09:00 AM Mon-Fri');
}

module.exports = { initStandupCron };
