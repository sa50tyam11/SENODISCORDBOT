const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Learn more about SENO Studio and this bot'),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Welcome to SENO Studio 🚀')
      .setColor('#84cc16') // Lime Green
      .setDescription('**SENO Studio** is a creative digital studio specializing in building amazing web experiences and fostering a collaborative community.')
      .addFields(
        { name: 'SENOBOT', value: 'This custom Discord bot was built specifically for managing our studio operations, monitoring sites, and keeping our community safe.' },
        { name: 'Tech Stack', value: 'Node.js, Discord.js, MongoDB' }
      )
      .setFooter({ text: 'SENO Studio' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Visit Our Website')
          .setStyle(ButtonStyle.Link)
          .setURL('https://your-website-link-goes-here.com') // We will update this!
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
