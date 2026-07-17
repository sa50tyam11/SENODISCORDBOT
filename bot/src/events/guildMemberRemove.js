const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    await sendLog(
      client,
      'Member Left',
      `<@${member.id}> (${member.user.tag}) left the server.`,
      '#FF5555' // Red
    );
  },
};
