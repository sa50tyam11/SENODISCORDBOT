const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Make a server announcement')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => 
      option.setName('title')
        .setDescription('The title of the announcement')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('message')
        .setDescription('The main text of the announcement')
        .setRequired(true))
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Channel to send the announcement to')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('color')
        .setDescription('Hex color code (e.g., #6C63FF)')
        .setRequired(false))
    .addRoleOption(option => 
      option.setName('ping')
        .setDescription('Role to ping with this announcement')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('image')
        .setDescription('URL of an image to attach')
        .setRequired(false)),
  
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel');
    const color = interaction.options.getString('color') || '#6C63FF';
    const pingRole = interaction.options.getRole('ping');
    const imageUrl = interaction.options.getString('image');

    // Create the embed
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(message)
      .setColor(color)
      .setTimestamp();

    if (imageUrl) {
      embed.setImage(imageUrl);
    }

    try {
      // Send the announcement
      let content = pingRole ? `<@&${pingRole.id}>` : undefined;
      await channel.send({ content, embeds: [embed] });
      
      // Reply to the user who ran the command
      await interaction.reply({ content: `Announcement successfully sent to ${channel}.`, ephemeral: true });

      // Log it
      await sendLog(
        interaction.client,
        'Announcement Sent',
        `**Moderator:** <@${interaction.user.id}>\n**Channel:** ${channel}\n**Title:** ${title}`,
        '#6C63FF'
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Failed to send the announcement. Please check permissions.', ephemeral: true });
    }
  },
};
