const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Display the SENO Studio server rules'),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('SENO Studio - Server Rules')
      .setColor('#6C63FF') // Electric Indigo
      .setDescription('Welcome to the SENO Studio Discord! Please abide by the following rules:')
      .addFields(
        { name: '1. Be Professional', value: 'Treat everyone with respect. This is a professional environment for our team and clients.' },
        { name: '2. No Spam or Self-Promotion', value: 'Do not spam channels or DM members with unsolicited offers.' },
        { name: '3. Keep to the Right Channels', value: 'Use the appropriate channels for your discussions.' },
        { name: '4. Do Not Share Internal Info', value: 'Client details and internal studio operations are strictly confidential.' },
        { name: '5. Follow Discord TOS', value: 'All standard Discord Terms of Service apply.' }
      )
      .setFooter({ text: 'Breaking rules may result in warnings, timeouts, or bans.' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
