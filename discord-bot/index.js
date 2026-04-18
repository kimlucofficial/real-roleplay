import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

import { getDb } from "../lib/db.js";

const db = getDb();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.on("interactionCreate", async (interaction) => {
  try {
    // =========================
    // BUTTON CLICK
    // =========================
    if (interaction.isButton()) {
      const [action, id, discordId] = interaction.customId.split("_");

      const modal = new ModalBuilder()
        // 🔥 lưu messageId để edit lại đúng message
        .setCustomId(
          `${action}_${id}_${discordId}_${interaction.message.id}`
        )
        .setTitle(
          action === "approve" ? "Approve Reason" : "Reject Reason"
        );

      const input = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Nhập lý do")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));

      return await interaction.showModal(modal);
    }

    // =========================
    // MODAL SUBMIT
    // =========================
    if (interaction.isModalSubmit()) {
      const [action, id, discordId, messageId] =
        interaction.customId.split("_");

      const reason = interaction.fields.getTextInputValue("reason");

      await interaction.deferReply({ ephemeral: true });

      let member = null;

      // fetch member an toàn
      try {
        member = await interaction.guild.members.fetch(discordId);
      } catch {
        console.log("Không fetch được member");
      }

      // =========================
      // APPROVE
      // =========================
      if (action === "approve") {
        await db.execute(
          "UPDATE whitelist_applications SET status='approved' WHERE id=?",
          [id]
        );

        if (member) {
          try {
            await member.roles.add(process.env.WHITELIST_ROLE_ID);
          } catch {
            console.log("Không add được role");
          }

          try {
            await member.send({
              embeds: [
                {
                  title: "🎉 WHITELIST APPROVED",
                  description: `Bạn đã được duyệt vào server.\n\n📌 Lý do:\n${reason}`,
                  color: 0x00ff00,
                },
              ],
            });
          } catch {
            console.log("Không gửi được DM");
          }
        }

        await interaction.editReply("✅ Đã duyệt + cấp role");
      }

      // =========================
      // REJECT
      // =========================
     if (action === "reject") {
  await db.execute(
    "UPDATE whitelist_applications SET status='rejected' WHERE id=?",
    [id]
  );

  try {
    const user = await client.users.fetch(discordId);

    try {
      await user.send({
        embeds: [
          {
            title: "❌ WHITELIST REJECTED",
            description: `Đơn của bạn đã bị từ chối.\n\n📌 Lý do:\n${reason}`,
            color: 0xff0000,
          },
        ],
      });
    } catch {
      console.log("User tắt DM");
    }
  } catch {
    console.log("Không fetch được user");
  }

  await interaction.editReply(`❌ Đã từ chối\nLý do: ${reason}`);
}

      // =========================
      // UPDATE MESSAGE (REMOVE BUTTON)
      // =========================
      try {
        const msg = await interaction.channel.messages.fetch(messageId);

        await msg.edit({
          components: [], // ❌ remove button
          content: `${
            action === "approve"
              ? "✅ Được duyệt"
              : "❌ Bị từ chối"
          } bởi ${interaction.user.tag}\nLý do: ${reason}`,
        });
      } catch (e) {
        console.log("Không edit được message:", e);
      }
    }
  } catch (err) {
    console.error("Lỗi interaction:", err);

    if (interaction.isRepliable()) {
      try {
        await interaction.reply({
          content: "❌ Có lỗi xảy ra, check console",
          ephemeral: true,
        });
      } catch {}
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);