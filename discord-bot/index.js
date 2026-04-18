import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from "discord.js";

import { getDb } from "../lib/db.js";

const db = getDb(); 

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    const [action, id, discordId] = interaction.customId.split("_");

    const modal = new ModalBuilder()
      .setCustomId(`${action}_${id}_${discordId}`)
      .setTitle(action === "approve" ? "Approve Reason" : "Reject Reason");

    const input = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Nhập lý do")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    await interaction.showModal(modal);
  }

  // submit modal
  if (interaction.isModalSubmit()) {
    const [action, id, discordId] = interaction.customId.split("_");

    const reason = interaction.fields.getTextInputValue("reason");

    await interaction.deferReply({ ephemeral: true });

    if (action === "approve") {
      await db.execute(
        "UPDATE whitelist_applications SET status='approved' WHERE id=?",
        [id]
      );

      const member = await interaction.guild.members.fetch(discordId);
      await member.roles.add(process.env.WHITELIST_ROLE_ID);

      // DM user
      await member.send(`✅ Bạn đã được duyệt whitelist \nFeedback: ${reason}`);

      await interaction.editReply("✅ Đã duyệt + Đã đưa role whitelist");
    }

   if (action === "reject") {
  try {
    await db.execute(
      "UPDATE whitelist_applications SET status='rejected' WHERE id=?",
      [id]
    );

    let member = null;

    try {
      member = await interaction.guild.members.fetch(discordId);
    } catch (e) {
      console.log("Không fetch được member");
    }

    if (member) {
      try {
        await member.send(`❌ Bạn đã bị từ chối whitelist\nLý do: ${reason}`);
      } catch (e) {
        console.log("Không gửi được DM");
      }
    }

    await interaction.editReply(`❌ Đã từ chối\nLý do: ${reason}`);
  } catch (err) {
    console.error(err);
    await interaction.editReply("❌ Lỗi khi reject (check log)");
  }
}

    

    const original = interaction.message;

    await original.edit({
      components: [], // ❌ remove buttons
      content: `✅ Được duyệt bởi ${interaction.user.tag}\nFeedback: ${reason}`
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
