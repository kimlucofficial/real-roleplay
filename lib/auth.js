import DiscordProviderModule from 'next-auth/providers/discord';

const DiscordProvider = DiscordProviderModule.default || DiscordProviderModule;

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email guilds' } }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id;
        token.username = profile.username;
        token.globalName = profile.global_name || profile.username;
        token.avatar = profile.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.discordId = token.discordId;
        session.user.username = token.username;
        session.user.globalName = token.globalName;
        session.user.avatar = token.avatar;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export function isAdminDiscordId(discordId) {
  const list = (process.env.ALLOWED_ADMIN_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return list.includes(String(discordId));
}


export async function isAdminSession(session) {
  const discordId = session?.user?.discordId;
  if (!discordId) return false;
  if (isAdminDiscordId(discordId)) return true;
  return hasAdminDiscordRole(discordId);
}

async function hasAdminDiscordRole(discordId) {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const adminRoleIds = (process.env.ADMIN_ROLE_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!guildId || !botToken || !adminRoleIds.length) return false;

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`, {
      headers: { Authorization: `Bot ${botToken}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn('[auth] Không check được Discord admin role', { status: res.status, discordId });
      return false;
    }

    const member = await res.json();
    const memberRoles = Array.isArray(member.roles) ? member.roles : [];
    return adminRoleIds.some((roleId) => memberRoles.includes(roleId));
  } catch (err) {
    console.warn('[auth] Lỗi check Discord admin role', { message: err?.message, discordId });
    return false;
  }
}
