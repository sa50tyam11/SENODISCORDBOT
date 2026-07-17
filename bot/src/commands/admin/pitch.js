const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pitch')
    .setDescription('Generate a proven sales pitch for a specific industry')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => 
      option.setName('industry')
        .setDescription('Which industry are you pitching?')
        .setRequired(true)
        .addChoices(
          { name: 'Real Estate / Realtors', value: 'real_estate' },
          { name: 'Restaurants / Cafes', value: 'restaurant' },
          { name: 'E-Commerce / Shopify', value: 'ecommerce' },
          { name: 'SaaS / Tech Startup', value: 'saas' },
          { name: 'General Local Business', value: 'local' }
        )),
        
  async execute(interaction) {
    const industry = interaction.options.getString('industry');

    let pitchText = '';

    switch (industry) {
      case 'real_estate':
        pitchText = `**🏘️ Real Estate Pitch**\n\n\`\`\`text\nHey [Name],\n\nI was looking at your recent listings and I love the properties you're handling in [City].\n\nI run SENO Studio, and we've been helping realtors build custom websites and automated chatbots that capture buyer leads 24/7, even when you're busy at a showing.\n\nAre you currently open to upgrading your digital presence to close more leads this quarter? If so, I’d love to send over a quick mockup of what we could do for you.\n\nBest,\n[Your Name]\nSENO Studio\n\`\`\``;
        break;
      case 'restaurant':
        pitchText = `**🍔 Restaurant Pitch**\n\n\`\`\`text\nHey [Name],\n\nI’m a huge fan of [Restaurant Name]—your [popular dish] looks amazing on Instagram!\n\nI noticed your website might not be optimized for mobile ordering or reservations. At SENO Studio, we build high-converting websites specifically for restaurants that turn profile visitors into paying diners.\n\nDo you have 5 minutes next week to chat about revamping your digital storefront?\n\nCheers,\n[Your Name]\nSENO Studio\n\`\`\``;
        break;
      case 'ecommerce':
        pitchText = `**🛍️ E-Commerce Pitch**\n\n\`\`\`text\nHi [Name],\n\nYour brand’s aesthetic is incredibly clean. I was browsing your store and saw a lot of potential to increase your conversion rate.\n\nMy team at SENO Studio specializes in building lightning-fast, high-converting E-Commerce stores and Discord community bots to build brand loyalty.\n\nAre you currently looking for ways to decrease cart abandonment and scale your sales? Let’s chat if so.\n\nBest,\n[Your Name]\nSENO Studio\n\`\`\``;
        break;
      case 'saas':
        pitchText = `**💻 SaaS Pitch**\n\n\`\`\`text\nHey [Name],\n\nReally impressed with what you're building at [Company Name]. The product looks incredibly intuitive.\n\nAt SENO Studio, we specialize in building custom Discord bots and community management systems for tech startups. We can automate your customer support, onboarding, and user retention directly inside Discord.\n\nAre you currently looking to streamline your community management?\n\nBest,\n[Your Name]\nSENO Studio\n\`\`\``;
        break;
      case 'local':
        pitchText = `**📍 General Local Business Pitch**\n\n\`\`\`text\nHi [Name],\n\nI came across [Business Name] and I love what you're doing in the [City] area!\n\nI run a digital agency called SENO Studio, and we help local businesses like yours completely dominate their local market through premium web design and automated customer service bots.\n\nAre you open to having a quick chat about getting more local customers through your doors this month?\n\nThanks,\n[Your Name]\nSENO Studio\n\`\`\``;
        break;
    }

    await interaction.reply({ 
      content: `Here is your proven pitching template. Just copy, paste, fill in the brackets, and send it!\n\n${pitchText}`, 
      ephemeral: true 
    });
  },
};
