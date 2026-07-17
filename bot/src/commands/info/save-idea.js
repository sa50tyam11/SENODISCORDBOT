const { SlashCommandBuilder } = require('discord.js');
const Idea = require('../../database/models/Idea');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('save-idea')
    .setDescription('Save a social media post or idea for later')
    .addStringOption(option => 
      option.setName('link')
        .setDescription('The link to the post or inspiration')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('notes')
        .setDescription('Why is this a good idea? (e.g., Use this hook, recreate this layout)')
        .setRequired(true)),
        
  async execute(interaction) {
    const link = interaction.options.getString('link');
    const notes = interaction.options.getString('notes');

    try {
      await Idea.create({
        userId: interaction.user.id,
        link,
        notes
      });
      await interaction.reply({ content: `✅ **Idea saved!** You can view all saved ideas later by typing \`/ideas\`.`, ephemeral: true });
    } catch (error) {
      console.error('Error saving idea:', error);
      await interaction.reply({ content: 'There was an error saving your idea to the database.', ephemeral: true });
    }
  },
};
