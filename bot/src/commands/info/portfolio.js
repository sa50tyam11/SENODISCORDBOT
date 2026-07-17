const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('portfolio')
    .setDescription('View the SENO Studio portfolio of work'),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('SENO Studio | Portfolio')
      .setColor('#6C63FF')
      .setDescription('Welcome to the SENO Studio portfolio! Click the buttons below to explore our work across different categories.')
      .addFields(
        { name: '🌐 Websites', value: 'Custom web development and design.', inline: true },
        { name: '🤖 Custom Bots', value: 'Advanced Discord bots and automation.', inline: true },
        { name: '📈 Marketing', value: 'Growth strategies and campaigns.', inline: true }
      )
      .setFooter({ text: 'SENO Studio - We build the future.' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('portfolio_web')
        .setLabel('Websites')
        .setEmoji('🌐')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('portfolio_bot')
        .setLabel('Custom Bots')
        .setEmoji('🤖')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('portfolio_marketing')
        .setLabel('Marketing')
        .setEmoji('📈')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
