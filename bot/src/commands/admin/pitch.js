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

    let englishPitch = '';
    let hinglishPitch = '';

    switch (industry) {
      case 'real_estate':
        englishPitch = `Hey [Name],\n\nI was looking at your recent listings and I love the properties you're handling in [City].\n\nI run SENO Studio, and we've been helping realtors build custom websites and automated chatbots that capture buyer leads 24/7, even when you're busy at a showing.\n\nAre you currently open to upgrading your digital presence to close more leads this quarter? If so, I’d love to send over a quick mockup of what we could do for you.\n\nBest,\n[Your Name]\nSENO Studio`;
        
        hinglishPitch = `Hey [Name],\n\nMain aapke recent listings dekh raha tha aur mujhe [City] mein aapki properties bahut achhi lagi.\n\nMain SENO Studio run karta hoon, aur hum realtors ki custom websites aur automated chatbots build karne mein help karte hain jo 24/7 buyer leads capture karte hain, even jab aap showing mein busy ho.\n\nKya aap iss quarter zyada leads close karne ke liye apni digital presence upgrade karne ke liye open hain? Agar haan, toh main aapko ek quick mockup bhej sakta hoon.\n\nBest,\n[Your Name]\nSENO Studio`;
        break;
        
      case 'restaurant':
        englishPitch = `Hey [Name],\n\nI’m a huge fan of [Restaurant Name]—your [popular dish] looks amazing on Instagram!\n\nI noticed your website might not be optimized for mobile ordering or reservations. At SENO Studio, we build high-converting websites specifically for restaurants that turn profile visitors into paying diners.\n\nDo you have 5 minutes next week to chat about revamping your digital storefront?\n\nCheers,\n[Your Name]\nSENO Studio`;
        
        hinglishPitch = `Hey [Name],\n\nMain [Restaurant Name] ka bahut bada fan hoon—aapka [popular dish] Instagram par amazing lagta hai!\n\nMaine notice kiya ki aapki website mobile ordering ya reservations ke liye optimized shayad nahi hai. SENO Studio mein, hum restaurants ke liye high-converting websites build karte hain jo profile visitors ko paying diners mein convert karte hain.\n\nKya aapke paas next week 5 minute hain apne digital storefront ko revamp karne ke baare mein baat karne ke liye?\n\nCheers,\n[Your Name]\nSENO Studio`;
        break;
        
      case 'ecommerce':
        englishPitch = `Hi [Name],\n\nYour brand’s aesthetic is incredibly clean. I was browsing your store and saw a lot of potential to increase your conversion rate.\n\nMy team at SENO Studio specializes in building lightning-fast, high-converting E-Commerce stores and Discord community bots to build brand loyalty.\n\nAre you currently looking for ways to decrease cart abandonment and scale your sales? Let’s chat if so.\n\nBest,\n[Your Name]\nSENO Studio`;
        
        hinglishPitch = `Hi [Name],\n\nAapke brand ka aesthetic bahut clean hai. Main aapka store browse kar raha tha aur mujhe aapki conversion rate increase karne ka bahut potential dikha.\n\nMeri team SENO Studio mein lightning-fast, high-converting E-Commerce stores aur brand loyalty build karne ke liye Discord community bots banane mein specialize karti hai.\n\nKya aap abhi cart abandonment decrease karne aur apni sales scale karne ke tarike dhundh rahe hain? Agar haan toh let's chat.\n\nBest,\n[Your Name]\nSENO Studio`;
        break;
        
      case 'saas':
        englishPitch = `Hey [Name],\n\nReally impressed with what you're building at [Company Name]. The product looks incredibly intuitive.\n\nAt SENO Studio, we specialize in building custom Discord bots and community management systems for tech startups. We can automate your customer support, onboarding, and user retention directly inside Discord.\n\nAre you currently looking to streamline your community management?\n\nBest,\n[Your Name]\nSENO Studio`;
        
        hinglishPitch = `Hey [Name],\n\nAap [Company Name] par jo build kar rahe hain usse sach mein impressed hoon. Product bahut intuitive lag raha hai.\n\nSENO Studio mein, hum tech startups ke liye custom Discord bots aur community management systems banane mein specialize karte hain. Hum aapke customer support, onboarding, aur user retention ko direct Discord ke andar automate kar sakte hain.\n\nKya aap abhi apni community management ko streamline karne ka soch rahe hain?\n\nBest,\n[Your Name]\nSENO Studio`;
        break;
        
      case 'local':
        englishPitch = `Hi [Name],\n\nI came across [Business Name] and I love what you're doing in the [City] area!\n\nI run a digital agency called SENO Studio, and we help local businesses like yours completely dominate their local market through premium web design and automated customer service bots.\n\nAre you open to having a quick chat about getting more local customers through your doors this month?\n\nThanks,\n[Your Name]\nSENO Studio`;
        
        hinglishPitch = `Hi [Name],\n\nMujhe [Business Name] ke baare mein pata chala aur mujhe bahut pasand aaya jo aap [City] area mein kar rahe hain!\n\nMain SENO Studio naam ki ek digital agency chalata hoon, aur hum aap jaise local businesses ki premium web design aur automated customer service bots ke through unki local market dominate karne mein madad karte hain.\n\nKya aap iss month apne doors ke through zyada local customers laane ke baare mein ek quick chat karne ke liye open hain?\n\nThanks,\n[Your Name]\nSENO Studio`;
        break;
    }

    const replyContent = `Here is your proven pitching template. Just copy, paste, fill in the brackets, and send it!\n\n**🇺🇸 English Version:**\n\`\`\`text\n${englishPitch}\n\`\`\`\n**🇮🇳 Hinglish Version:**\n\`\`\`text\n${hinglishPitch}\n\`\`\``;

    // Removed ephemeral: true so everyone in the channel can see it!
    await interaction.reply({ 
      content: replyContent 
    });
  },
};
