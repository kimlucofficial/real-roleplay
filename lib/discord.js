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
            { name: "👤 User", value: application.full_name },
            { name: "💬 Discord ID", value: application.discord_id },
            { name: "🎂 Age", value: String(application.age) },
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
              custom_id: `reject_${id}`,
            },
          ],
        },
      ],
    }),
  });
}
