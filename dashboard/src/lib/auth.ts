import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: 'identify guilds guilds.members.read' } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord') {
        const guildId = '1470824083360055448';
        const founderRoleId = '1470824083426906126';
        const cofounderRoleId = '1527632441202704404';

        try {
          // Fetch the user's member object in the specific guild using the bot's token (not the OAuth token)
          // Wait, actually it's better to fetch their guilds using the user's access_token
          const res = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });

          if (!res.ok) {
            console.error('Failed to fetch guild member info');
            return false; // Not in guild or api error
          }

          const member = await res.json();
          
          if (member.roles.includes(founderRoleId) || member.roles.includes(cofounderRoleId)) {
            return true; // Allowed
          }

          console.log(`User ${user.name} denied. Roles:`, member.roles);
          return false; // Denied

        } catch (error) {
          console.error(error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
