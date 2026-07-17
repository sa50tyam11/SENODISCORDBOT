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

        if (!memberRoleId) {
          return interaction.reply({ content: 'Verification roles are not configured properly.', ephemeral: true });
        }

        try {
          await interaction.member.roles.add(memberRoleId);
          if (unverifiedRoleId) {
            await interaction.member.roles.remove(unverifiedRoleId);
          }
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
      } else if (interaction.customId === 'ticket_create_btn') {
        const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
        const modal = new ModalBuilder()
          .setCustomId('ticket_modal')
          .setTitle('Request a Quote');

        const projectType = new TextInputBuilder().setCustomId('ticket_type').setLabel('Project Type (Web, Bot, Marketing)').setStyle(TextInputStyle.Short).setRequired(true);
        const budget = new TextInputBuilder().setCustomId('ticket_budget').setLabel('Estimated Budget').setStyle(TextInputStyle.Short).setRequired(true);
        const details = new TextInputBuilder().setCustomId('ticket_details').setLabel('Project Details').setStyle(TextInputStyle.Paragraph).setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(projectType),
          new ActionRowBuilder().addComponents(budget),
          new ActionRowBuilder().addComponents(details)
        );

        await interaction.showModal(modal);
      } else if (interaction.customId.startsWith('portfolio_')) {
        const config = require('../config.json');
        const category = interaction.customId.replace('portfolio_', '');
        const projects = config.portfolio?.[category] || [];
        const { EmbedBuilder } = require('discord.js');

        if (projects.length === 0) {
          return interaction.reply({ content: 'No projects added to this category yet!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setTitle(`SENO Studio | ${category.charAt(0).toUpperCase() + category.slice(1)} Portfolio`)
          .setColor('#6C63FF')
          .setFooter({ text: 'SENO Studio - We build the future.' });

        projects.forEach((proj, index) => {
          embed.addFields({ name: `${proj.title}`, value: `${proj.description}\n[View Project](${proj.url})`, inline: false });
          if (index === 0 && proj.imageUrl) {
            embed.setImage(proj.imageUrl);
          }
        });

        await interaction.update({ embeds: [embed], components: interaction.message.components });
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
      } else if (interaction.customId === 'ticket_modal') {
        const type = interaction.fields.getTextInputValue('ticket_type');
        const budget = interaction.fields.getTextInputValue('ticket_budget');
        const details = interaction.fields.getTextInputValue('ticket_details');
        
        const config = require('../config.json');
        const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

        try {
          const categoryId = config.tickets?.categoryId;
          
          const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: categoryId || null,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
              },
              {
                id: config.roles.founderRoleId,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
              },
              {
                id: config.roles.cofounderRoleId,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
              }
            ],
          });

          const embed = new EmbedBuilder()
            .setTitle('New Project Inquiry')
            .setColor('#6C63FF')
            .setDescription(`Hello <@${interaction.user.id}>! The SENO Studio team will be with you shortly.`)
            .addFields(
              { name: 'Project Type', value: type, inline: true },
              { name: 'Budget', value: budget, inline: true },
              { name: 'Details', value: details, inline: false }
            )
            .setFooter({ text: 'To close this ticket, an admin can type /close-ticket' });

          await channel.send({ content: `<@${interaction.user.id}> <@&${config.roles.founderRoleId}>`, embeds: [embed] });
          await interaction.reply({ content: `Your ticket has been created! Please head over to <#${channel.id}>.`, ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'There was an error creating your ticket.', ephemeral: true });
        }
      }
    }
  },
};
