const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember, client) {
    // Check for role changes
    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
      const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
      const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

      if (addedRoles.size > 0) {
        const rolesText = addedRoles.map(r => `<@&${r.id}>`).join(', ');
        await sendLog(client, 'Role Added', `<@${newMember.id}> was given the role(s): ${rolesText}`, '#6C63FF');
      }

      if (removedRoles.size > 0) {
        const rolesText = removedRoles.map(r => `<@&${r.id}>`).join(', ');
        await sendLog(client, 'Role Removed', `<@${newMember.id}> was removed from the role(s): ${rolesText}`, '#FF5555');
      }
    }
  },
};
