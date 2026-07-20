const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ClientLog = require('../../database/models/ClientLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logclient')
    .setDescription('Log a new client interaction (Cold call, Insta DM, etc.)')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the client')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('source')
        .setDescription('Where did we talk to them? (Cold Call, Insta DM, LinkedIn, etc.)')
        .setRequired(true)),
        
  async execute(interaction) {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return interaction.reply({ content: '❌ Database is not connected! Please add your `MONGODB_URI` in the `.env` file first.', ephemeral: true });
    }

    const name = interaction.options.getString('name');
    const source = interaction.options.getString('source');

    try {
      // Create a pending client log
      const log = await ClientLog.create({
        name: name,
        source: source,
        status: 'pending',
        loggedBy: interaction.user.id
      });

      const embed = new EmbedBuilder()
        .setTitle('New Client Logged 📝')
        .setColor('#FFA500')
        .addFields(
          { name: 'Client Name', value: name, inline: true },
          { name: 'Source', value: source, inline: true },
          { name: 'Logged By', value: `<@${interaction.user.id}>`, inline: false }
        )
        .setDescription('Did this client agree or show interest?')
        .setFooter({ text: 'Select an option below to keep or remove this client' })
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`client_keep_${log._id}`)
            .setLabel('✅ Interested (Keep)')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`client_remove_${log._id}`)
            .setLabel('❌ Not Interested (Remove)')
            .setStyle(ButtonStyle.Danger)
        );

      await interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Error logging client:', error);
      await interaction.reply({ content: 'There was an error saving the client log.', ephemeral: true });
    }
  },
};
