const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => 
      option.setName('target')
        .setDescription('The member to timeout')
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for timeout')),
        
  async execute(interaction) {
    const target = interaction.options.getMember('target');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      return interaction.reply({ content: 'Could not find that member.', ephemeral: true });
    }

    if (!target.moderatable) {
      return interaction.reply({ content: 'I cannot timeout this member.', ephemeral: true });
    }

    try {
      const msDuration = duration * 60 * 1000;
      await target.timeout(msDuration, reason);
      await interaction.reply({ content: `Successfully timed out <@${target.id}> for ${duration} minutes. Reason: ${reason}` });
      
      await sendLog(
        interaction.client,
        'Member Timed Out',
        `**Moderator:** <@${interaction.user.id}>\n**Target:** <@${target.id}>\n**Duration:** ${duration} minutes\n**Reason:** ${reason}`,
        '#FFAA00'
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to timeout this member.', ephemeral: true });
    }
  },
};
