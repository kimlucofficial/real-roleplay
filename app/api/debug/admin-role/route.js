import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function parseIds(value) {
  return String(value || '')
    .split(/[,\n\s]+/)
    .map((s) => (s.match(/\d{15,25}/) || [''])[0])
    .filter(Boolean);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return Response.json({ ok: false, reason: 'NOT_LOGGED_IN' }, { status: 401 });
  }

  const guildId = process.env.DISCORD_GUILD_ID || process.env.DISCORD_SERVER_ID || process.env.GUILD_ID || '';
  const rawBotToken = process.env.DISCORD_BOT_TOKEN || process.env.BOT_TOKEN || '';
  const botToken = String(rawBotToken || '').replace(/^Bot\s+/i, '').trim();
  const adminRoleIds = parseIds(process.env.ADMIN_ROLE_IDS);

  const result = {
    ok: false,
    discordId,
    guildIdSet: Boolean(guildId),
    botTokenSet: Boolean(botToken),
    adminRoleIdsCount: adminRoleIds.length,
    discordApiStatus: null,
    userRoleCount: 0,
    matchedRoleIds: [],
    reason: null
  };

  if (!guildId) result.reason = 'MISSING_DISCORD_GUILD_ID';
  if (!botToken) result.reason = 'MISSING_DISCORD_BOT_TOKEN';
  if (!adminRoleIds.length) result.reason = 'MISSING_ADMIN_ROLE_IDS';
  if (result.reason) return Response.json(result);

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`, {
      headers: { Authorization: `Bot ${botToken}` },
      cache: 'no-store'
    });

    result.discordApiStatus = res.status;

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      result.reason = res.status === 401 ? 'BOT_TOKEN_INVALID' : res.status === 403 ? 'BOT_MISSING_PERMISSION' : res.status === 404 ? 'USER_NOT_FOUND_IN_GUILD_OR_WRONG_GUILD_ID' : 'DISCORD_API_ERROR';
      result.discordApiError = text.slice(0, 300);
      return Response.json(result);
    }

    const member = await res.json();
    const roles = Array.isArray(member.roles) ? member.roles.map(String) : [];
    const matched = adminRoleIds.filter((id) => roles.includes(id));

    result.userRoleCount = roles.length;
    result.matchedRoleIds = matched;
    result.ok = matched.length > 0;
    result.reason = result.ok ? 'HAS_ADMIN_ROLE' : 'NO_MATCHING_ADMIN_ROLE';
    return Response.json(result);
  } catch (err) {
    result.reason = 'CHECK_FAILED';
    result.error = err?.message || String(err);
    return Response.json(result, { status: 500 });
  }
}
