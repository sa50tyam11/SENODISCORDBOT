const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available SENO Studio bot commands'),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('SENO Studio Bot Commands 📚')
      .setColor('#84cc16') // Lime Green
      .setDescription('Here is your cheat sheet for all the main features and commands!')
      
      .addFields(
        { name: '💼 Agency & Sales', value: '`/invoice` - Generate an invoice with a live UPI QR code\n`/contract` - Generate a Service Agreement/NDA\n`/portfolio` - View our live portfolio links\n`/pitch [industry]` - Generate a custom pitching message' },
        { name: '💡 Marketing & Ideas', value: '`/save-idea [link] [notes]` - Save an inspiration or social media idea\n`/ideas` - View all saved ideas for the week' },
        { name: '🛠️ Internal Workflows', value: '`/standup` - Log your daily progress\n`/focus [hours]` - Enter focus mode (blocks pings)' },
        { name: '⚙️ Admin Setups', value: '`/ticket-setup` - Drop the Request Quote panel\n`/role-setup` - Drop the role assignment panel\n`/verify-setup` - Drop the security verification panel\n`/announce` - Broadcast a message globally' },
        { name: '🛡️ Moderation', value: '`/kick`, `/ban`, `/timeout`, `/warn`, `/purge`\n*(Automod automatically tracks bad words, GIFs, and links - 3 strikes = kick)*' }
      )
      .setFooter({ text: 'SENO Studio Operations' })
      .setTimestamp();

    // Ephemeral so it doesn't clog chat
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
