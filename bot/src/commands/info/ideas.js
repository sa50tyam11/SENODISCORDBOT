const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Idea = require('../../database/models/Idea');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ideas')
    .setDescription('View the saved Idea Bank for social media inspiration')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      // Get the last 10 ideas sorted by newest first
      const ideas = await Idea.find().sort({ createdAt: -1 }).limit(10);

      if (!ideas || ideas.length === 0) {
        return interaction.editReply({ content: 'Your Idea Bank is currently empty! Use `/save-idea` to save some inspiration.' });
      }

      const embed = new EmbedBuilder()
        .setTitle('💡 SENO Studio Idea Bank')
        .setDescription('Here are the latest saved ideas and inspirations for your marketing:')
        .setColor('#F1C40F')
        .setTimestamp();

      ideas.forEach((idea, index) => {
        // Discord embed fields can have max 1024 chars for value
        const dateStr = idea.createdAt.toLocaleDateString();
        embed.addFields({
          name: `Idea #${ideas.length - index} (${dateStr})`,
          value: `**Notes:** ${idea.notes}\n**Link:** [Click Here](${idea.link})`
        });
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching ideas:', error);
      await interaction.editReply({ content: 'There was an error retrieving the ideas from the database.' });
    }
  },
};
