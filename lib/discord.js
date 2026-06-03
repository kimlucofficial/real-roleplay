const DISCORD_FIELD_MAX = 1024;
const DISCORD_TOTAL_EMBED_MAX = 6000;

function truncateDiscordText(value, max = 900) {
  const text = String(value || 'N/A').trim() || 'N/A';
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 3))}...`;
}

function field(name, value, max = 900) {
  return {
    name: truncateDiscordText(name, 256),
    value: truncateDiscordText(value, Math.min(max, DISCORD_FIELD_MAX))
  };
}

function discordCustomId(action, id, discordId) {
  return `${action}_${id}_${discordId}`.slice(0, 100);
}

function embedCharCount(embed) {
  const fields = embed.fields || [];
  return [
    embed.title,
    embed.description,
    embed.footer?.text,
    embed.author?.name,
    ...fields.flatMap((item) => [item.name, item.value])
  ].reduce((sum, item) => sum + String(item || '').length, 0);
}

function compactEmbed(embed) {
  if (embedCharCount(embed) <= DISCORD_TOTAL_EMBED_MAX) return embed;

  const compact = {
    ...embed,
    fields: embed.fields.map((item) => {
      if (item.name.includes('Tiểu sử')) return field(item.name, item.value, 700);
      if (item.name.includes('Cam kết')) return field(item.name, item.value, 500);
      return field(item.name, item.value, 300);
    })
  };

  return compact;
}

export async function sendWhitelistEmbed(application) {
  if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_CHANNEL_ID) {
    console.warn('[discord] DISCORD_BOT_TOKEN hoặc DISCORD_CHANNEL_ID chưa được set, bỏ qua thông báo whitelist.');
    return;
  }

  const id = application.id;
  const adminBaseUrl = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL.replace(/\/$/, '')}/admin` : '';
  const adminUrl = adminBaseUrl ? `${adminBaseUrl}#application-${id}` : '';

  const embed = compactEmbed({
    title: '📩 New Whitelist Application',
    description: adminUrl ? `ID đơn: **#${id}**\nXem full hồ sơ tại Admin Dashboard: ${adminUrl}` : `ID đơn: **#${id}**`,
    color: 0xd4af37,
    fields: [
      field('👤 Name', application.full_name, 300),
      field('💬 Discord', application.discord_username, 300),
      field('🆔 Discord ID', application.discord_id, 100),
      field('🎂 Age', application.age, 50),
      field('🚻 Giới tính', application.rp_experience, 120),
      field('⏰ Khung giờ online', application.online_time, 160),
      field('🛡️ Kiểm Soát Chất Lượng', application.source, 160),
      field('🎭 Tên nhân vật', application.short_description, 160),
      field('📖 Tiểu sử nhân vật (rút gọn)', application.backstory, 900),
      field('✅ Cam kết luật server (rút gọn)', application.why_join, 700),
      ...(adminUrl ? [field('🔗 Xem đầy đủ tiểu sử', adminUrl, 300)] : [])
    ],
    timestamp: new Date().toISOString()
  });

  const payload = {
    embeds: [embed],
    components: [
      {
        type: 1,
        components: [
          ...(adminUrl ? [{ type: 2, label: 'Xem đầy đủ', style: 5, url: adminUrl }] : []),
          { type: 2, label: 'Approve', style: 3, custom_id: discordCustomId('approve', id, application.discord_id) },
          { type: 2, label: 'Reject', style: 4, custom_id: discordCustomId('reject', id, application.discord_id) }
        ]
      }
    ],
    allowed_mentions: { parse: [] }
  };

  const res = await fetch(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Discord whitelist embed failed: ${res.status} ${text}`);
  }
}
