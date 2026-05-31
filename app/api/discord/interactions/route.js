import { verifyKey } from 'discord-interactions';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PING = 1;
const PONG = 1;
const MESSAGE_COMPONENT = 3;
const CHANNEL_MESSAGE_WITH_SOURCE = 4;
const MODAL_RESPONSE = 9;
const MODAL_SUBMIT = 5;
const EPHEMERAL = 64;

function json(data, init) {
  return Response.json(data, init);
}

function safeLog(label, data = {}) {
  try {
    console.log(`[discord interactions] ${label}`, JSON.stringify(data));
  } catch {
    console.log(`[discord interactions] ${label}`, data);
  }
}

function safeError(label, err, extra = {}) {
  console.error(`[discord interactions] ${label}`, {
    message: err?.message,
    code: err?.code,
    errno: err?.errno,
    sqlState: err?.sqlState,
    sqlMessage: err?.sqlMessage,
    stack: err?.stack,
    ...extra
  });
}

function parseButtonCustomId(customId = '') {
  // Hỗ trợ cả 2 kiểu:
  // approve_12_123456789 / reject_12_123456789
  // approve:12:123456789 / reject:12:123456789
  const parts = customId.includes(':') ? customId.split(':') : customId.split('_');
  return {
    action: parts[0],
    id: parts[1],
    discordId: parts[2] || ''
  };
}

function parseModalCustomId(customId = '') {
  // rrwl:approve:12:123456789:messageId
  const parts = customId.split(':');
  return {
    action: parts[1],
    id: parts[2],
    discordId: parts[3] || '',
    messageId: parts[4] || ''
  };
}

function getReason(interaction) {
  const rows = interaction?.data?.components || [];
  for (const row of rows) {
    for (const component of row.components || []) {
      if (component.custom_id === 'reason') return component.value || '';
    }
  }
  return '';
}

async function discordApi(path, options = {}) {
  if (!process.env.DISCORD_BOT_TOKEN) {
    safeLog('skip Discord API because DISCORD_BOT_TOKEN is missing', { path });
    return null;
  }

  const res = await fetch(`https://discord.com/api/v10${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[discord interactions] Discord API error:', res.status, text);
  }

  return res;
}

async function processWhitelistResult(interaction) {
  const { action, id, discordId, messageId } = parseModalCustomId(interaction.data.custom_id);
  const reason = getReason(interaction);
  const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : null;

  safeLog('modal submit parsed', {
    action,
    id,
    discordId,
    messageId,
    status,
    hasReason: Boolean(reason),
    guildId: interaction.guild_id || null,
    channelId: interaction.channel_id || null
  });

  if (!status || !id || Number.isNaN(Number(id))) {
    throw new Error(`Invalid whitelist modal custom_id: ${interaction.data.custom_id}`);
  }

  const db = getDb();

  safeLog('DB UPDATE start', { id: Number(id), status });
  const [result] = await db.query(
    'UPDATE whitelist_applications SET status = ?, staff_note = ? WHERE id = ?',
    [status, reason || null, Number(id)]
  );
  safeLog('DB UPDATE done', {
    id: Number(id),
    status,
    affectedRows: result?.affectedRows,
    changedRows: result?.changedRows,
    warningStatus: result?.warningStatus
  });

  if (!result?.affectedRows) {
    throw new Error(`Không tìm thấy đơn whitelist id=${id} trong database để update status=${status}`);
  }

  // Approve thì cấp role nếu có đủ ENV.
  if (status === 'approved' && discordId && interaction.guild_id && process.env.WHITELIST_ROLE_ID) {
    safeLog('role add start', { guildId: interaction.guild_id, discordId, roleId: process.env.WHITELIST_ROLE_ID });
    await discordApi(`/guilds/${interaction.guild_id}/members/${discordId}/roles/${process.env.WHITELIST_ROLE_ID}`, {
      method: 'PUT',
      body: '{}'
    });
    safeLog('role add done', { discordId });
  } else if (status === 'approved') {
    safeLog('role add skipped', {
      hasDiscordId: Boolean(discordId),
      hasGuildId: Boolean(interaction.guild_id),
      hasRoleId: Boolean(process.env.WHITELIST_ROLE_ID)
    });
  }

  // DM user nếu fetch được user.
  if (discordId) {
    safeLog('DM start', { discordId });
    const dm = await discordApi('/users/@me/channels', {
      method: 'POST',
      body: JSON.stringify({ recipient_id: discordId })
    });

    if (dm?.ok) {
      const channel = await dm.json().catch(() => null);
      if (channel?.id) {
        await discordApi(`/channels/${channel.id}/messages`, {
          method: 'POST',
          body: JSON.stringify({
            embeds: [
              {
                title: status === 'approved' ? '🎉 WHITELIST APPROVED' : '❌ WHITELIST REJECTED',
                description: status === 'approved'
                  ? `Bạn đã được duyệt vào server.\n\n📌 Lý do:\n${String(reason || 'Không có lý do.').slice(0, 3500)}`
                  : `Đơn whitelist của bạn đã bị từ chối.\n\n📌 Lý do:\n${String(reason || 'Không có lý do.').slice(0, 3500)}`,
                color: status === 'approved' ? 0x00ff00 : 0xff0000
              }
            ]
          })
        });
      }
    }
    safeLog('DM done/attempted', { discordId });
  }

  // Gỡ nút trên message gốc để tránh staff bấm lại.
  if (interaction.channel_id && messageId) {
    safeLog('message patch start', { channelId: interaction.channel_id, messageId });
    await discordApi(`/channels/${interaction.channel_id}/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        content: `${status === 'approved' ? '✅ Được duyệt' : '❌ Bị từ chối'} bởi ${interaction.member?.user?.username || interaction.user?.username || 'staff'}\nLý do: ${reason || 'Không có lý do.'}`,
        components: []
      })
    });
    safeLog('message patch done', { messageId });
  }
}


export async function GET() {
  return Response.json({
    ok: true,
    route: '/api/discord/interactions',
    message: 'Discord interactions route is deployed and reachable.'
  });
}

export async function POST(req) {
  console.log('[discord interactions] POST HIT BEFORE VERIFY', { url: req.url, method: req.method });
  try {
    const signature = req.headers.get('x-signature-ed25519');
    const timestamp = req.headers.get('x-signature-timestamp');
    const rawBody = await req.text();
    console.log('[discord interactions] RAW BODY READ', { length: rawBody.length, hasSignature: Boolean(signature), hasTimestamp: Boolean(timestamp), hasPublicKey: Boolean(process.env.DISCORD_PUBLIC_KEY) });

    const isValid = await verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY || '');
    if (!isValid) {
      console.error('[discord interactions] bad signature', {
        hasSignature: Boolean(signature),
        hasTimestamp: Boolean(timestamp),
        hasPublicKey: Boolean(process.env.DISCORD_PUBLIC_KEY)
      });
      return new Response('Bad request signature', { status: 401 });
    }

    const interaction = JSON.parse(rawBody);
    safeLog('received', {
      type: interaction.type,
      customId: interaction.data?.custom_id || null,
      user: interaction.member?.user?.id || interaction.user?.id || null,
      guildId: interaction.guild_id || null,
      channelId: interaction.channel_id || null
    });

    // Discord Developer Portal verify endpoint bằng POST PING.
    // Phải trả đúng { type: 1 } ngay lập tức, không query DB/role/DM ở bước này.
    if (interaction.type === PING) {
      safeLog('PING received - returning PONG', { type: interaction.type, response: { type: PONG } });
      return new Response(JSON.stringify({ type: PONG }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Bấm nút Approve/Reject: trả modal NGAY, không đụng DB ở bước này.
    if (interaction.type === MESSAGE_COMPONENT) {
      const { action, id, discordId } = parseButtonCustomId(interaction.data.custom_id);
      safeLog('button parsed', { action, id, discordId, originalCustomId: interaction.data.custom_id });

      if ((action === 'approve' || action === 'reject') && id) {
        const messageId = interaction.message?.id || '';

        return json({
          type: MODAL_RESPONSE,
          data: {
            custom_id: `rrwl:${action}:${id}:${discordId}:${messageId}`,
            title: action === 'approve' ? 'Approve Whitelist' : 'Reject Whitelist',
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: 'reason',
                    label: 'Nhập lý do',
                    style: 2,
                    min_length: 1,
                    max_length: 1000,
                    required: true,
                    placeholder: action === 'approve' ? 'Ví dụ: Hồ sơ đạt yêu cầu RP.' : 'Ví dụ: Tiểu sử nhân vật chưa đủ chi tiết.'
                  }
                ]
              }
            ]
          }
        });
      }
    }

    // Submit modal: ACK Discord NGAY để không bị Interaction failed, rồi xử lý DB/role/DM phía sau.
    if (interaction.type === MODAL_SUBMIT && interaction.data?.custom_id?.startsWith('rrwl:')) {
      processWhitelistResult(interaction).catch((err) => {
        safeError('processWhitelistResult failed', err, { customId: interaction.data?.custom_id });
      });

      return json({
        type: CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '✅ Đã nhận xử lý whitelist. Đang cập nhật DB/role/DM.',
          flags: EPHEMERAL
        }
      });
    }

    safeLog('unsupported interaction', { type: interaction.type, customId: interaction.data?.custom_id || null });
    return json({
      type: CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: 'Unsupported interaction. Check Vercel logs: unsupported interaction.', flags: EPHEMERAL }
    });
  } catch (err) {
    safeError('POST crashed before response', err);
    return json({
      type: CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `❌ Interaction route lỗi trước khi xử lý xong: ${err?.message || 'Unknown error'}`,
        flags: EPHEMERAL
      }
    });
  }
}
