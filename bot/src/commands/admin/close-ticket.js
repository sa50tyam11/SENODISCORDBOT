const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close the current ticket channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
        
  async execute(interaction) {
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: 'This command can only be used in a ticket channel.', ephemeral: true });
    }

    await interaction.reply('Closing ticket in 5 seconds...');
    
    setTimeout(async () => {
      try {
        await interaction.channel.delete();
      } catch (err) {
        console.error('Failed to delete ticket channel', err);
      }
    }, 5000);
  },
};
