const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Deploy the Request a Quote button for clients')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Work with SENO Studio 🚀')
      .setColor('#6C63FF')
      .setDescription('Ready to build something amazing? Whether it is a website, a custom Discord bot, or social media marketing, we have you covered.\n\nClick the button below to request a quote and chat directly with our team!');

    const ticketButton = new ButtonBuilder()
      .setCustomId('ticket_create_btn')
      .setLabel('Request a Quote')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('✉️');

    const row = new ActionRowBuilder().addComponents(ticketButton);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Ticket system deployed!', ephemeral: true });
  },
};
