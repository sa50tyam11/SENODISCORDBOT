const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => 
      option.setName('target')
        .setDescription('The member to kick')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for kicking')),
        
  async execute(interaction) {
    const target = interaction.options.getMember('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      return interaction.reply({ content: 'Could not find that member.', ephemeral: true });
    }

    if (!target.kickable) {
      return interaction.reply({ content: 'I cannot kick this member.', ephemeral: true });
    }

    try {
      await target.kick(reason);
      await interaction.reply({ content: `Successfully kicked <@${target.id}>. Reason: ${reason}` });
      
      await sendLog(
        interaction.client,
        'Member Kicked',
        `**Moderator:** <@${interaction.user.id}>\n**Target:** <@${target.id}>\n**Reason:** ${reason}`,
        '#FF5555'
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to kick this member.', ephemeral: true });
    }
  },
};
