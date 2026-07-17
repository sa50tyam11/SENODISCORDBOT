const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => 
      option.setName('target')
        .setDescription('The member to warn')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for warning')
        .setRequired(true)),
        
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');
    const moderatorId = interaction.user.id;

    try {
      // Save to SQLite DB
      const stmt = db.prepare('INSERT INTO warnings (userId, moderatorId, reason) VALUES (?, ?, ?)');
      stmt.run(target.id, moderatorId, reason);

      // Get total warnings
      const countStmt = db.prepare('SELECT COUNT(*) as count FROM warnings WHERE userId = ?');
      const result = countStmt.get(target.id);
      const totalWarnings = result.count;

      await interaction.reply({ content: `Successfully warned <@${target.id}>. They now have ${totalWarnings} warning(s).` });
      
      // DM the user
      try {
        await target.send(`You have been warned in SENO Studio for: **${reason}**`);
      } catch (dmError) {
        console.log(`Could not DM user ${target.id} about their warning.`);
      }

      await sendLog(
        interaction.client,
        'Member Warned',
        `**Moderator:** <@${moderatorId}>\n**Target:** <@${target.id}>\n**Reason:** ${reason}\n**Total Warnings:** ${totalWarnings}`,
        '#FFFF00'
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to warn this member.', ephemeral: true });
    }
  },
};
