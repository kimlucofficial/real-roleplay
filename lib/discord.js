export async function sendWhitelistEmbed(application) {
  if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_CHANNEL_ID) return;

  const id = application.id;

  await fetch(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      embeds: [
        {
          title: "📩 New Whitelist Application",
         fields: [
  { name: "👤 Name", value: application.full_name || "N/A" },
  { name: "💬 Discord", value: application.discord_username || "N/A" },
  { name: "🆔 Discord ID", value: application.discord_id || "N/A" },
  { name: "🎂 Age", value: String(application.age || "N/A") },
  { name: "🚻 Giới tính", value: application.rp_experience || "N/A" },
  { name: "⏰ Khung giờ online", value: application.online_time || "N/A" },
  { name: "🛡️ Kiểm Soát Chất Lượng", value: application.source || "N/A" },
  { name: "🎭 Tên nhân vật", value: application.short_description || "N/A" },
  { name: "📖 Tiểu sử nhân vật", value: application.backstory || "N/A" },
  { name: "✅ Cam kết luật server", value: application.why_join || "N/A" },
],
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Approve",
              style: 3,
              custom_id: `approve_${id}_${application.discord_id}`,
            },
            {
              type: 2,
              label: "Reject",
              style: 4,
              custom_id: `reject_${id}_${application.discord_id}`,
            },
          ],
        },
      ],
    }),
  });
}
