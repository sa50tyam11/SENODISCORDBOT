const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-setup')
    .setDescription('Set up the verification button in the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Welcome to SENO Studio!')
      .setColor('#6C63FF')
      .setDescription('To gain access to the rest of the server, please click the verify button below.\n\nBy verifying, you agree to follow the server rules.');

    const verifyButton = new ButtonBuilder()
      .setCustomId('verify_button')
      .setLabel('Verify')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅');

    const row = new ActionRowBuilder().addComponents(verifyButton);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Verification message deployed!', ephemeral: true });
  },
};
