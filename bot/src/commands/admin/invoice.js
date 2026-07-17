const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invoice')
    .setDescription('Generate a professional invoice with payment details')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => 
      option.setName('amount')
        .setDescription('The total amount due (e.g., $500 or ₹10000)')
        .setRequired(true))
    .addUserOption(option => 
      option.setName('client')
        .setDescription('The client to bill')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('description')
        .setDescription('What is this payment for? (e.g., Website Phase 1)')
        .setRequired(true)),
        
  async execute(interaction) {
    const amount = interaction.options.getString('amount');
    const client = interaction.options.getUser('client');
    const description = interaction.options.getString('description');

    const upi = config.payments?.upi || 'Not configured';
    const paypal = config.payments?.paypal || 'Not configured';
    const bank = config.payments?.bank || 'Not configured';
    const qrCodeUrl = config.payments?.qrCodeUrl || '';

    const embed = new EmbedBuilder()
      .setTitle('SENO Studio Invoice')
      .setColor('#6C63FF')
      .setDescription(`Hello <@${client.id}>, your invoice for **${description}** is ready.`)
      .addFields(
        { name: 'Amount Due', value: `**${amount}**`, inline: false },
        { name: 'UPI', value: `\`${upi}\``, inline: true },
        { name: 'PayPal', value: paypal, inline: true },
        { name: 'Bank Details', value: `\`\`\`text\n${bank}\n\`\`\``, inline: false }
      )
      .setFooter({ text: 'Thank you for choosing SENO Studio!' })
      .setTimestamp();

    // Auto-generate a QR code for the UPI ID if no custom image is provided
    let finalQrUrl = qrCodeUrl;
    if (!finalQrUrl && upi !== 'Not configured') {
      finalQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${encodeURIComponent(upi)}`;
    }

    if (finalQrUrl) {
      embed.setImage(finalQrUrl);
    }

    await interaction.reply({ content: `<@${client.id}>`, embeds: [embed] });
  },
};
