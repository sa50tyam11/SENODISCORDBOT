const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const FocusMode = require('../../database/models/FocusMode');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('focus')
    .setDescription('Enter Focus Mode to let others know you are busy')
    .addIntegerOption(option => 
      option.setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1440)), // Max 24 hours
        
  async execute(interaction) {
    const duration = interaction.options.getInteger('duration');
    const expiresAt = new Date(Date.now() + duration * 60000).toISOString();

    try {
      await FocusMode.findOneAndUpdate(
        { userId: interaction.user.id },
        { expiresAt: new Date(expiresAt) },
        { upsert: true, new: true }
      );

      const embed = new EmbedBuilder()
        .setTitle('🧘 Focus Mode Activated')
        .setDescription(`You are now in Focus Mode for the next **${duration} minutes**.\nIf anyone mentions you, I will let them know you are busy.`)
        .setColor('#84cc16'); // Lime Green

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Failed to set focus mode:', error);
      await interaction.reply({ content: 'Could not activate Focus Mode.', ephemeral: true });
    }
  },
};
