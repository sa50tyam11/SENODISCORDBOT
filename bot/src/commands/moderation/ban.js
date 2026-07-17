const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => 
      option.setName('target')
        .setDescription('The member to ban')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for banning')),
        
  async execute(interaction) {
    const target = interaction.options.getMember('target');
    const user = interaction.options.getUser('target'); // In case member is not in server
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (target && !target.bannable) {
      return interaction.reply({ content: 'I cannot ban this member.', ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(user, { reason });
      await interaction.reply({ content: `Successfully banned <@${user.id}>. Reason: ${reason}` });
      
      await sendLog(
        interaction.client,
        'Member Banned',
        `**Moderator:** <@${interaction.user.id}>\n**Target:** <@${user.id}>\n**Reason:** ${reason}`,
        '#FF0000'
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to ban this member.', ephemeral: true });
    }
  },
};
