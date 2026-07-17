const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role-setup')
    .setDescription('Set up the self-assign role buttons in the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎭 Choose Your Role')
      .setColor('#6C63FF')
      .setDescription('Click a button below to get or remove the corresponding role.');

    const btnDev = new ButtonBuilder()
      .setCustomId('role_dev')
      .setLabel('Developer')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('💻');
      
    const btnDesign = new ButtonBuilder()
      .setCustomId('role_design')
      .setLabel('Designer')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('🎨');

    const btnClient = new ButtonBuilder()
      .setCustomId('role_client')
      .setLabel('Client Contact')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('🤝');

    const row = new ActionRowBuilder().addComponents(btnDev, btnDesign, btnClient);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Role setup message deployed!', ephemeral: true });
  },
};
