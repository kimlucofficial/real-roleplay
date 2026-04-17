import { Client, GatewayIntentBits } from "discord.js";
import mysql from "mysql2/promise";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const db = await mysql.createConnection(process.env.DATABASE_URL);

client.on("ready", () => {
  console.log("Bot ready");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  await interaction.deferReply({ ephemeral: true }); // 🔥 THÊM DÒNG NÀY

  const parts = interaction.customId.split("_");

  if (parts[0] === "approve") {
    const id = parts[1];
    const discordId = parts[2];

    await db.execute(
      "UPDATE whitelist_applications SET status='approved' WHERE id=?",
      [id]
    );

    const member = await interaction.guild.members.fetch(discordId);
    await member.roles.add(process.env.WHITELIST_ROLE_ID);

    await interaction.editReply("✅ Approved + Role given");
  }

  if (parts[0] === "reject") {
    const id = parts[1];

    await db.execute(
      "UPDATE whitelist_applications SET status='rejected' WHERE id=?",
      [id]
    );

    await interaction.editReply("❌ Rejected");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
