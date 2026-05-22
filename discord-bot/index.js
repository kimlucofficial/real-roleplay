import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";

import { getDb } from "../lib/db.js";

const db = getDb();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

function parseWhitelistCustomId(customId = "") {
  const parts = customId.includes(":") ? customId.split(":") : customId.split("_");

  // Button: approve_12_123456789 / reject_12_123456789
  if (parts[0] === "approve" || parts[0] === "reject") {
    return {
      action: parts[0],
      applicationId: parts[1],
      discordId: parts[2],
      messageId: parts[3] || null,
    };
  }

  // Modal from web route old format: rrwl:approve:12:123456789:messageId
  if (parts[0] === "rrwl") {
    return {
      action: parts[1],
      applicationId: parts[2],
      discordId: parts[3],
      messageId: parts[4] || null,
    };
  }

  return null;
}

function isValidSnowflake(value) {
  return /^\d{15,25}$/.test(String(value || ""));
}

const RR_EMOJIS = {
  crown: "<a:1115crown3:1507012431409582141>",
  trophy: "<:3021trophy:1507012465290907718>",
  logo: "<:image:1506989509886218391>",
};

function truncateText(value = "", max = 900) {
  const text = String(value || "").trim();
  if (text.length <= max) return text || "Không có ghi chú.";
  return `${text.slice(0, max - 3)}...`;
}

async function sendResultDm(discordId, status, reason) {
  if (!isValidSnowflake(discordId)) return false;

  const approved = status === "approved";
  const safeReason = truncateText(reason || "Không có ghi chú.");

  const embed = new EmbedBuilder()
    .setColor(approved ? 0xd4af37 : 0xb91c1c)
    .setTitle(
      approved
        ? `${RR_EMOJIS.crown} REAL ROLEPLAY | WHITELIST APPROVED`
        : `${RR_EMOJIS.logo} REAL ROLEPLAY | WHITELIST RESULT`
    )
    .setDescription(
      approved
        ? [
            `${RR_EMOJIS.trophy} **Chúc mừng! Hồ sơ whitelist của bạn đã được duyệt.**`,
            "",
            "Bạn đã chính thức vượt qua vòng xét duyệt và có thể bắt đầu hành trình Roleplay tại **Real Roleplay**.",
            "",
            "Vui lòng đọc kỹ luật server, giữ thái độ nghiêm túc và xây dựng nhân vật đúng tinh thần RP.",
          ].join("\n")
        : [
            "Rất tiếc, hồ sơ whitelist của bạn **chưa được duyệt ở lần này**.",
            "",
            "Bạn có thể xem lại góp ý bên dưới, chỉnh sửa hồ sơ/kịch bản nhân vật và thử lại khi đã sẵn sàng.",
          ].join("\n")
    )
    .addFields(
      {
        name: approved ? "🏆 Trạng thái" : "📌 Trạng thái",
        value: approved ? "**ĐÃ ĐƯỢC DUYỆT**" : "**ĐÃ BỊ TỪ CHỐI**",
        inline: true,
      },
      {
        name: "📝 Phản hồi từ Staff",
        value: safeReason,
        inline: false,
      },
      {
        name: approved ? "👑 Bước tiếp theo" : "🔁 Gợi ý tiếp theo",
        value: approved
          ? "Hãy vào server Discord để nhận thông tin tiếp theo và chuẩn bị vào thành phố."
          : "Hãy bổ sung thêm chi tiết nhân vật, tình huống RP và đảm bảo câu trả lời đúng yêu cầu.",
        inline: false,
      }
    )
    .setFooter({ text: "Real Roleplay • Whitelist System" })
    .setTimestamp();

  try {
    const user = await client.users.fetch(discordId);
    await user.send({
      content: approved
        ? `${RR_EMOJIS.logo} **Real Roleplay Whitelist Result**`
        : `${RR_EMOJIS.logo} **Real Roleplay Whitelist Update**`,
      embeds: [embed],
    });
    return true;
  } catch (err) {
    console.log("Không gửi được DM:", err?.message || err);
    return false;
  }
}

async function addWhitelistRole(interaction, discordId) {
  if (!process.env.WHITELIST_ROLE_ID) {
    console.log("Thiếu WHITELIST_ROLE_ID nên bỏ qua cấp role.");
    return false;
  }

  if (!interaction.guild || !isValidSnowflake(discordId)) return false;

  try {
    const member = await interaction.guild.members.fetch(discordId);
    await member.roles.add(process.env.WHITELIST_ROLE_ID);
    return true;
  } catch (err) {
    console.log("Không add được role:", err?.message || err);
    return false;
  }
}

async function updateApplication(applicationId, status, reason) {
  const [result] = await db.execute(
    "UPDATE whitelist_applications SET status = ?, staff_note = ? WHERE id = ?",
    [status, reason || null, Number(applicationId)]
  );

  return result?.affectedRows || 0;
}

client.once("ready", () => {
  console.log(`✅ Discord bot online: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    // =========================
    // APPROVE / REJECT BUTTON
    // =========================
    if (interaction.isButton()) {
      const parsed = parseWhitelistCustomId(interaction.customId);

      if (!parsed || !["approve", "reject"].includes(parsed.action) || !parsed.applicationId) {
        return;
      }

      const modal = new ModalBuilder()
        .setCustomId(
          `rrwl:${parsed.action}:${parsed.applicationId}:${parsed.discordId || ""}:${interaction.message.id}`
        )
        .setTitle(parsed.action === "approve" ? "Approve Whitelist" : "Reject Whitelist");

      const input = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Nhập lý do")
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(1)
        .setMaxLength(1000)
        .setRequired(true)
        .setPlaceholder(
          parsed.action === "approve"
            ? "Ví dụ: Hồ sơ đạt yêu cầu RP."
            : "Ví dụ: Tiểu sử nhân vật chưa đủ chi tiết."
        );

      modal.addComponents(new ActionRowBuilder().addComponents(input));
      await interaction.showModal(modal);
      return;
    }

    // =========================
    // MODAL SUBMIT
    // =========================
    if (interaction.isModalSubmit()) {
      const parsed = parseWhitelistCustomId(interaction.customId);

      if (!parsed || !["approve", "reject"].includes(parsed.action) || !parsed.applicationId) {
        return;
      }

      await interaction.deferReply({ ephemeral: true });

      const status = parsed.action === "approve" ? "approved" : "rejected";
      const approved = status === "approved";
      const reason = interaction.fields.getTextInputValue("reason") || "Không có lý do.";

      const affectedRows = await updateApplication(parsed.applicationId, status, reason);
      if (!affectedRows) {
        await interaction.editReply(`❌ Không tìm thấy đơn ID ${parsed.applicationId} trong database.`);
        return;
      }

      const roleAdded = approved ? await addWhitelistRole(interaction, parsed.discordId) : false;
      const dmSent = await sendResultDm(parsed.discordId, status, reason);

      try {
        const messageId = parsed.messageId || interaction.message?.id;

        if (messageId && interaction.channel) {
          const msg = await interaction.channel.messages.fetch(messageId);

          const resultEmbed = new EmbedBuilder()
            .setColor(approved ? 0x22c55e : 0xef4444)
            .setTitle(approved ? "✅ WHITELIST APPROVED" : "❌ WHITELIST REJECTED")
            .addFields(
              {
                name: "👮 Staff xử lý",
                value: `${interaction.user.tag}`,
                inline: true,
              },
              {
                name: "📝 Lý do",
                value: reason,
                inline: false,
              },
              {
                name: "🎖️ Role Whitelist",
                value: approved
                  ? roleAdded
                    ? "✅ Đã cấp role"
                    : "⚠️ Chưa cấp được role"
                  : "—",
                inline: true,
              },
              {
                name: "📨 DM",
                value: dmSent ? "✅ Đã gửi DM" : "⚠️ Không gửi được DM",
                inline: true,
              }
            )
            .setFooter({ text: "Powered by Real Roleplay" })
            .setTimestamp();

          await msg.edit({
            content: `${approved ? "✅ Được duyệt" : "❌ Bị từ chối"} bởi ${interaction.user.tag}`,
            embeds: [...msg.embeds, resultEmbed],
            components: [],
          });
        }
      } catch (err) {
        console.log("Không edit được message:", err?.message || err);
      }

      await interaction.editReply(
        approved
          ? `✅ Đã duyệt đơn #${parsed.applicationId}${roleAdded ? " + đã cấp role" : " nhưng chưa cấp được role"}${dmSent ? " + đã DM" : " + không DM được"}`
          : `❌ Đã từ chối đơn #${parsed.applicationId}${dmSent ? " + đã DM" : " + không DM được"}`
      );
    }
  } catch (err) {
    console.error("Lỗi interaction:", err);

    if (interaction.isRepliable()) {
      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply("❌ Có lỗi xảy ra, check console bot.");
        } else {
          await interaction.reply({ content: "❌ Có lỗi xảy ra, check console bot.", ephemeral: true });
        }
      } catch {}
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
