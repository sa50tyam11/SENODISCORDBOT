const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Learn more about SENO Studio and this bot'),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('SENO Studio 🚀')
      .setColor('#84cc16') // Lime Green
      .setDescription('*Where ideas become interfaces.*\n\nAt SENO Studio, we believe great design isn\\'t decoration — it\\'s how an idea learns to speak.\n\nWe\\'re a studio with a simple obsession: turning rough ideas into products that feel effortless. From web applications to custom bots, from full-stack IT solutions to social media marketing that actually moves the needle — every project starts with the same question: not "what can we build," but "what should this feel like to use."\n\nWe work with clients pan-India and globally, building the web, automating the busywork, and helping brands show up online the way they deserve to. Good taste, sharp execution, and people who care — that\\'s SENO Studio.')
      .addFields(
        { name: 'Our Services', value: 'Web Development · Custom Discord Bots · IT Solutions · Social Media Marketing' },
        { name: 'SENOBOT', value: 'This custom Discord bot was built specifically for managing our studio operations.' }
      )
      .setFooter({ text: 'Design with intention. Built for the world.' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Visit Our Website')
          .setStyle(ButtonStyle.Link)
          .setURL('https://senostudio.in') 
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
