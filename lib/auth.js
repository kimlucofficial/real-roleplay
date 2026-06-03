import DiscordProviderModule from 'next-auth/providers/discord';

const DiscordProvider = DiscordProviderModule.default || DiscordProviderModule;

function parseDiscordIds(value) {
  return String(value || '')
    .split(/[,.\n\s]+/)
    .map((s) => s.trim())
    .map((s) => {
      const match = s.match(/\d{15,25}/);
      return match ? match[0] : '';
    })
    .filter(Boolean);
}

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
  const adminIds = parseDiscordIds(process.env.ALLOWED_ADMIN_IDS);
  return adminIds.includes(String(discordId));
}

export async function isAdminSession(session) {
  const discordId = session?.user?.discordId;
  if (!discordId) return false;

  // Cách 1: cấp quyền trực tiếp bằng Discord User ID.
  if (isAdminDiscordId(discordId)) return true;

  // Cách 2: cấp quyền bằng Discord Role ID trong server.
  return hasAdminDiscordRole(discordId);
}

async function hasAdminDiscordRole(discordId) {
  const guildId =
    process.env.DISCORD_GUILD_ID ||
    process.env.DISCORD_SERVER_ID ||
    process.env.GUILD_ID;

  const rawBotToken =
    process.env.DISCORD_BOT_TOKEN ||
    process.env.BOT_TOKEN;

  // Railway/Vercel có người hay paste token dạng "Bot xxxxx".
  // Discord API header cần đúng 1 chữ Bot, nên mình tự bóc prefix để tránh bị "Bot Bot ...".
  const botToken = String(rawBotToken || '').replace(/^Bot\s+/i, '').trim();

  const adminRoleIds = parseDiscordIds(process.env.ADMIN_ROLE_IDS);

  if (!adminRoleIds.length) {
    console.warn('[auth] ADMIN_ROLE_IDS chưa được set hoặc không có Role ID hợp lệ.');
    return false;
  }

  if (!guildId) {
    console.warn('[auth] Thiếu DISCORD_GUILD_ID. Không thể check role admin.');
    return false;
  }

  if (!botToken) {
    console.warn('[auth] Thiếu DISCORD_BOT_TOKEN. Không thể check role admin.');
    return false;
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`, {
      headers: { Authorization: `Bot ${botToken}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.warn('[auth] Không check được Discord admin role', {
        status: res.status,
        discordId,
        guildId,
        error: errorText.slice(0, 250)
      });
      return false;
    }

    const member = await res.json();
    const memberRoles = Array.isArray(member.roles) ? member.roles.map(String) : [];
    const allowed = adminRoleIds.some((roleId) => memberRoles.includes(roleId));

    if (!allowed) {
      console.warn('[auth] User không có role admin được phép', {
        discordId,
        adminRoleIds,
        memberRoleCount: memberRoles.length
      });
    }

    return allowed;
  } catch (err) {
    console.warn('[auth] Lỗi check Discord admin role', { message: err?.message, discordId, guildId });
    return false;
  }
}
