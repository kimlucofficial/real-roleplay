import { Client, GatewayIntentBits } from "discord.js";
import mysql from "mysql2/promise";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const db = await mysql.createConnection(process.env.DATABASE_URL);

client.on("ready", () => {
  console.log("Bot ready");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const parts = interaction.customId.split("_");

  if (parts[0] === "approve") {
    const id = parts[1];
    const discordId = parts[2];

    await db.execute("UPDATE whitelist_applications SET status='approved' WHERE id=?", [id]);

    // give role
    const guild = interaction.guild;
    const member = await guild.members.fetch(discordId);
    await member.roles.add(process.env.WHITELIST_ROLE_ID);

    await interaction.reply({ content: "✅ Approved + Role given", ephemeral: true });
  }

  if (parts[0] === "reject") {
    const id = parts[1];
    await db.execute("UPDATE whitelist_applications SET status='rejected' WHERE id=?", [id]);
    await interaction.reply({ content: "❌ Rejected", ephemeral: true });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
