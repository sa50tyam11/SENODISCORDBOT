const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('contract')
    .setDescription('Generate a standard service agreement/NDA for a client')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => 
      option.setName('client_name')
        .setDescription('Full name or company name of the client')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('project_type')
        .setDescription('What kind of project? (e.g., Custom Web Development, Discord Bot)')
        .setRequired(true)),
        
  async execute(interaction) {
    const clientName = interaction.options.getString('client_name');
    const projectType = interaction.options.getString('project_type');

    const contractText = `**SENO STUDIO | SERVICE AGREEMENT & NDA**

This Service Agreement ("Agreement") is entered into by and between **SENO Studio** ("Provider") and **${clientName}** ("Client").

**1. SCOPE OF SERVICES**
Provider agrees to deliver professional services for: **${projectType}**.
All exact specifications, milestones, and deliverables will be discussed and agreed upon in the project's private ticket channel.

**2. CONFIDENTIALITY (NDA)**
Both parties agree to keep all proprietary information, trade secrets, data, and business strategies completely confidential. Provider will not share Client's sensitive data with any third parties without explicit consent.

**3. PAYMENTS & OWNERSHIP**
- Work will commence upon receipt of the agreed initial deposit.
- Final intellectual property and source code rights will be transferred to the Client only after full and final payment has been made.
- Provider retains the right to display the finalized public work in their portfolio, unless explicitly requested otherwise by the Client.

**4. REVISIONS & MAINTENANCE**
Standard projects include 2 rounds of minor revisions. Major architectural changes post-approval may incur additional fees. Any post-launch maintenance will require a separate agreement or retainer.

*By proceeding with the initial invoice payment, the Client agrees to these standard terms.*`;

    const embed = new EmbedBuilder()
      .setTitle('📝 Project Service Agreement')
      .setColor('#2F3136')
      .setDescription(contractText)
      .setFooter({ text: 'SENO Studio Legal' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
