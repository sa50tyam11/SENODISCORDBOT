const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Learn more about this bot and SENO Studio'),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('About SENOBOT')
      .setColor('#84cc16') // Lime Green
      .setDescription('SENOBOT is the custom internal management bot for SENO Studio.')
      .addFields(
        { name: 'Purpose', value: 'Built specifically for managing team operations, client site monitoring, and server moderation.' },
        { name: 'Tech Stack', value: 'Node.js, Discord.js, SQLite' },
        { name: 'Version', value: '1.0.0 (Phase 1)' }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
