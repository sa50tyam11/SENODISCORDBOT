const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    
    // Set a custom status if desired
    client.user.setActivity('over SENO Studio', { type: 3 }); // 3 is Watching
  },
};
