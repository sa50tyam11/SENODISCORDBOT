const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      // Handle button clicks (e.g., verification)
      if (interaction.customId === 'verify_button') {
        const config = require('../config.json');
        const unverifiedRoleId = config.roles.unverifiedRoleId;
        const memberRoleId = config.roles.memberRoleId;

        if (!unverifiedRoleId || !memberRoleId) {
          return interaction.reply({ content: 'Verification roles are not configured properly.', ephemeral: true });
        }

        try {
          await interaction.member.roles.add(memberRoleId);
          await interaction.member.roles.remove(unverifiedRoleId);
          await interaction.reply({ content: 'You have been verified! Welcome to SENO Studio.', ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'There was an error verifying you. Please contact an admin.', ephemeral: true });
        }
      } else if (interaction.customId === 'standup_prompt_btn') {
        // Show the same modal as the /standup command
        const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
        const modal = new ModalBuilder()
          .setCustomId('standup_modal')
          .setTitle('Daily Standup');

        const yesterdayInput = new TextInputBuilder().setCustomId('standup_yesterday').setLabel('What did you do yesterday?').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const todayInput = new TextInputBuilder().setCustomId('standup_today').setLabel('What will you do today?').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const blockersInput = new TextInputBuilder().setCustomId('standup_blockers').setLabel('Any blockers?').setStyle(TextInputStyle.Short).setRequired(false).setPlaceholder('None');

        modal.addComponents(
          new ActionRowBuilder().addComponents(yesterdayInput),
          new ActionRowBuilder().addComponents(todayInput),
          new ActionRowBuilder().addComponents(blockersInput)
        );

        await interaction.showModal(modal);
      } else if (interaction.customId.startsWith('role_')) {
        const config = require('../config.json');
        let roleId;
        
        if (interaction.customId === 'role_dev') roleId = config.roles.developerRoleId;
        if (interaction.customId === 'role_design') roleId = config.roles.designerRoleId;
        if (interaction.customId === 'role_client') roleId = config.roles.clientContactRoleId;

        if (!roleId) {
          return interaction.reply({ content: 'This role is not configured yet.', ephemeral: true });
        }

        try {
          if (interaction.member.roles.cache.has(roleId)) {
            await interaction.member.roles.remove(roleId);
            await interaction.reply({ content: `Removed <@&${roleId}> role.`, ephemeral: true });
          } else {
            await interaction.member.roles.add(roleId);
            await interaction.reply({ content: `Added <@&${roleId}> role.`, ephemeral: true });
          }
        } catch (err) {
          console.error(err);
          await interaction.reply({ content: 'Error updating role. Check my permissions!', ephemeral: true });
        }
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === 'standup_modal') {
        const yesterday = interaction.fields.getTextInputValue('standup_yesterday');
        const today = interaction.fields.getTextInputValue('standup_today');
        const blockers = interaction.fields.getTextInputValue('standup_blockers') || 'None';
        
        const StandupLog = require('../database/models/StandupLog');
        const { EmbedBuilder } = require('discord.js');
        const config = require('../config.json');

        try {
          await StandupLog.create({
            userId: interaction.user.id,
            yesterday,
            today,
            blockers
          });

          const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}'s Standup`, iconURL: interaction.user.displayAvatarURL() })
            .setColor('#6C63FF')
            .addFields(
              { name: 'Yesterday', value: yesterday },
              { name: 'Today', value: today },
              { name: 'Blockers', value: blockers }
            )
            .setTimestamp();

          // Send to standup channel if configured, otherwise just reply in channel where it was run
          const standupChannelId = config.channels.standupChannelId;
          if (standupChannelId) {
            const channel = await client.channels.fetch(standupChannelId);
            if (channel) await channel.send({ embeds: [embed] });
            await interaction.reply({ content: 'Standup submitted successfully!', ephemeral: true });
          } else {
            await interaction.reply({ content: 'Standup submitted successfully!', embeds: [embed] });
          }
        } catch (error) {
          console.error('Error saving standup:', error);
          await interaction.reply({ content: 'There was an error saving your standup.', ephemeral: true });
        }
      }
    }
  },
};
