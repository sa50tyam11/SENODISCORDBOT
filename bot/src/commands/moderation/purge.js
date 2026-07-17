const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete a specified number of messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),
        
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      
      await interaction.reply({ content: `Successfully deleted ${deleted.size} messages.`, ephemeral: true });
      
      await sendLog(
        interaction.client,
        'Messages Purged',
        `**Moderator:** <@${interaction.user.id}>\n**Channel:** ${interaction.channel}\n**Amount:** ${deleted.size} messages`,
        '#84cc16' // Lime Green accent
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to purge messages.', ephemeral: true });
    }
  },
};
