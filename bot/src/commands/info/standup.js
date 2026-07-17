const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('standup')
    .setDescription('Submit your daily standup report'),
        
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('standup_modal')
      .setTitle('Daily Standup');

    const yesterdayInput = new TextInputBuilder()
      .setCustomId('standup_yesterday')
      .setLabel('What did you do yesterday?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const todayInput = new TextInputBuilder()
      .setCustomId('standup_today')
      .setLabel('What will you do today?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const blockersInput = new TextInputBuilder()
      .setCustomId('standup_blockers')
      .setLabel('Any blockers?')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setPlaceholder('None');

    const row1 = new ActionRowBuilder().addComponents(yesterdayInput);
    const row2 = new ActionRowBuilder().addComponents(todayInput);
    const row3 = new ActionRowBuilder().addComponents(blockersInput);

    modal.addComponents(row1, row2, row3);

    await interaction.showModal(modal);
  },
};
