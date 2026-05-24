import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
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




const ticketPanelCommand = new SlashCommandBuilder()
  .setName("ticketpanel")
  .setDescription("Tạo panel ticket Real Roleplay")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const announcementCommand = new SlashCommandBuilder()
  .setName("thongbao")
  .setDescription("Đăng thông báo embed vào một kênh")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption((option) =>
    option
      .setName("kenh")
      .setDescription("Chọn kênh cần đăng thông báo")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .addStringOption((option) =>
    option
      .setName("tieude")
      .setDescription("Tiêu đề thông báo")
      .setRequired(true)
      .setMaxLength(256)
  )
  .addStringOption((option) =>
    option
      .setName("noidung")
      .setDescription("Nội dung thông báo")
      .setRequired(true)
      .setMaxLength(4000)
  )
  .addStringOption((option) =>
    option
      .setName("mau")
      .setDescription("Màu thanh bên trái của embed")
      .setRequired(false)
      .addChoices(
        { name: "🟡 Vàng Gold", value: "gold" },
        { name: "🟢 Xanh Lá", value: "green" },
        { name: "🔴 Đỏ", value: "red" },
        { name: "🔵 Xanh Dương", value: "blue" },
        { name: "🟣 Tím", value: "purple" },
        { name: "⚫ Đen", value: "dark" }
      )
  )
  .addBooleanOption((option) =>
    option
      .setName("everyone")
      .setDescription("Có tag @everyone không?")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("hinhanh")
      .setDescription("Link ảnh/banner lớn trong embed")
      .setRequired(false)
      .setMaxLength(1000)
  )
  .addStringOption((option) =>
    option
      .setName("thumbnail")
      .setDescription("Link ảnh nhỏ góc phải embed")
      .setRequired(false)
      .setMaxLength(1000)
  )
  .addStringOption((option) =>
    option
      .setName("video")
      .setDescription("Link video muốn gửi kèm thông báo (YouTube/TikTok/MP4/Discord CDN)")
      .setRequired(false)
      .setMaxLength(1000)
  )
  .addStringOption((option) =>
    option
      .setName("footer")
      .setDescription("Dòng chữ footer, mặc định: Powered by Real Roleplay")
      .setRequired(false)
      .setMaxLength(200)
  );

async function registerSlashCommands() {
  try {
    if (process.env.DISCORD_GUILD_ID) {
      const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
      await guild.commands.set([announcementCommand.toJSON(), ticketPanelCommand.toJSON()]);
      console.log("✅ Đã đăng ký slash command /thongbao + /ticketpanel cho guild.");
      return;
    }

    await client.application.commands.set([announcementCommand.toJSON(), ticketPanelCommand.toJSON()]);
    console.log("✅ Đã đăng ký slash command /thongbao + /ticketpanel global.");
  } catch (err) {
    console.error("❌ Không đăng ký được slash command:", err?.message || err);
  }
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


function sanitizeChannelName(value = "ticket") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "ticket";
}

async function sendTicketPanel(interaction) {
  const panelChannelId = process.env.TICKET_PANEL_CHANNEL_ID;
  const panelChannel = panelChannelId
    ? await interaction.guild.channels.fetch(panelChannelId).catch(() => null)
    : interaction.channel;

  if (!panelChannel || panelChannel.type !== ChannelType.GuildText) {
    await interaction.editReply("❌ Không tìm thấy TICKET_PANEL_CHANNEL_ID hoặc kênh panel không phải kênh chữ.");
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0xd4af37)
    .setAuthor({ name: "REAL ROLEPLAY", iconURL: interaction.client.user.displayAvatarURL() })
    .setTitle("🎫 HỆ THỐNG TICKET")
    .setDescription([
      "Cần hỗ trợ hoặc muốn báo lỗi? Hãy chọn đúng mục bên dưới để tạo ticket.",
      "",
      "🛡️ **Support**: Hỗ trợ chung, câu hỏi, cần staff giúp đỡ.",
      "🐞 **Báo lỗi**: Báo bug website/server/gameplay/script.",
      "",
      "Vui lòng không spam ticket và mô tả vấn đề rõ ràng để staff xử lý nhanh hơn."
    ].join("\n"))
    .setFooter({ text: "Real Roleplay • Ticket System" })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("rr_ticket_support")
      .setLabel("Support")
      .setEmoji("🛡️")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("rr_ticket_bug")
      .setLabel("Báo lỗi")
      .setEmoji("🐞")
      .setStyle(ButtonStyle.Danger)
  );

  await panelChannel.send({ embeds: [embed], components: [row] });
  await interaction.editReply(`✅ Đã tạo panel ticket tại ${panelChannel}.`);
}

async function createTicketChannel(interaction, type) {
  const isBug = type === "bug";
  const categoryId = isBug ? process.env.TICKET_BUG_CATEGORY_ID : process.env.TICKET_SUPPORT_CATEGORY_ID;
  const staffRoleId = process.env.TICKET_STAFF_ROLE_ID;

  if (!categoryId) {
    await interaction.reply({ content: `❌ Thiếu ${isBug ? "TICKET_BUG_CATEGORY_ID" : "TICKET_SUPPORT_CATEGORY_ID"}.`, ephemeral: true });
    return;
  }

  const guild = interaction.guild;
  const category = await guild.channels.fetch(categoryId).catch(() => null);
  if (!category || category.type !== ChannelType.GuildCategory) {
    await interaction.reply({ content: "❌ Category ticket không hợp lệ. Hãy kiểm tra lại ID category trên Railway.", ephemeral: true });
    return;
  }

  const prefix = isBug ? "bug" : "support";
  const safeUser = sanitizeChannelName(interaction.user.username);
  const channelName = `${prefix}-${safeUser}`.slice(0, 90);

  const existing = guild.channels.cache.find(
    (ch) => ch.parentId === categoryId && ch.topic?.includes(`USER_ID:${interaction.user.id}`)
  );

  if (existing) {
    await interaction.reply({ content: `⚠️ Bạn đã có ticket đang mở: ${existing}`, ephemeral: true });
    return;
  }

  const permissionOverwrites = [
    { id: guild.roles.everyone.id, deny: ["ViewChannel"] },
    { id: interaction.user.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AttachFiles"] },
  ];

  if (staffRoleId && isValidSnowflake(staffRoleId)) {
    permissionOverwrites.push({
      id: staffRoleId,
      allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AttachFiles", "ManageChannels"],
    });
  }

  const ticketChannel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: categoryId,
    topic: `REAL ROLEPLAY TICKET | TYPE:${prefix} | USER_ID:${interaction.user.id}`,
    permissionOverwrites,
  });

  const embed = new EmbedBuilder()
    .setColor(isBug ? 0xef4444 : 0x3b82f6)
    .setTitle(isBug ? "🐞 Ticket Báo Lỗi" : "🛡️ Ticket Support")
    .setDescription([
      `${interaction.user}, ticket của bạn đã được tạo.`,
      "",
      isBug
        ? "Vui lòng mô tả lỗi, thời gian xảy ra, hình ảnh/video nếu có."
        : "Vui lòng mô tả vấn đề bạn cần hỗ trợ càng rõ càng tốt.",
      "",
      staffRoleId && isValidSnowflake(staffRoleId) ? `<@&${staffRoleId}> sẽ hỗ trợ bạn sớm nhất.` : "Staff sẽ hỗ trợ bạn sớm nhất."
    ].join("\n"))
    .setFooter({ text: "Real Roleplay • Ticket System" })
    .setTimestamp();

  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("rr_ticket_close")
      .setLabel("Đóng ticket")
      .setEmoji("🔒")
      .setStyle(ButtonStyle.Secondary)
  );

  await ticketChannel.send({
    content: staffRoleId && isValidSnowflake(staffRoleId) ? `${interaction.user} <@&${staffRoleId}>` : `${interaction.user}`,
    embeds: [embed],
    components: [closeRow],
    allowedMentions: { users: [interaction.user.id], roles: staffRoleId && isValidSnowflake(staffRoleId) ? [staffRoleId] : [] },
  });

  await interaction.reply({ content: `✅ Đã tạo ticket cho bạn: ${ticketChannel}`, ephemeral: true });
}

async function closeTicket(interaction) {
  if (!interaction.channel?.topic?.includes("REAL ROLEPLAY TICKET")) {
    await interaction.reply({ content: "❌ Lệnh này chỉ dùng trong kênh ticket.", ephemeral: true });
    return;
  }

  await interaction.reply({ content: "🔒 Ticket sẽ đóng sau 3 giây...", ephemeral: true });
  setTimeout(() => {
    interaction.channel.delete("Real Roleplay ticket closed").catch((err) => console.log("Không xoá được ticket:", err?.message || err));
  }, 3000);
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

client.once("ready", async () => {
  console.log(`✅ Discord bot online: ${client.user.tag}`);
  await registerSlashCommands();
});

client.on("interactionCreate", async (interaction) => {
  try {
    // =========================
    // /THONGBAO COMMAND
    // =========================
    if (interaction.isChatInputCommand() && interaction.commandName === "ticketpanel") {
      await interaction.deferReply({ ephemeral: true });
      await sendTicketPanel(interaction);
      return;
    }

    if (interaction.isChatInputCommand() && interaction.commandName === "thongbao") {
      await interaction.deferReply({ ephemeral: true });

      const channel = interaction.options.getChannel("kenh");
      const title = interaction.options.getString("tieude");
      const rawDescription = interaction.options.getString("noidung");
  const description = rawDescription.replace(/\\n/g, "\n");
      const colorChoice = interaction.options.getString("mau") || "gold";
      const pingEveryone = interaction.options.getBoolean("everyone") || false;
      const imageUrl = interaction.options.getString("hinhanh");
      const thumbnailUrl = interaction.options.getString("thumbnail");
      const videoUrl = interaction.options.getString("video");
      const footerText = interaction.options.getString("footer") || "Powered by Real Roleplay";

      if (!channel || channel.type !== ChannelType.GuildText) {
        await interaction.editReply("❌ Kênh không hợp lệ. Chỉ được chọn kênh chữ.");
        return;
      }

      const colors = {
        gold: 0xd4af37,
        green: 0x22c55e,
        red: 0xef4444,
        blue: 0x3b82f6,
        purple: 0xa855f7,
        dark: 0x111827,
      };

      const embed = new EmbedBuilder()
        .setColor(colors[colorChoice] || colors.gold)
        .setAuthor({
          name: "REAL ROLEPLAY",
          iconURL: "https://cdn.discordapp.com/emojis/1506989509886218391.png",
        })
        .setTitle(title)
        .setDescription(description)
        .setFooter({
          text: footerText,
          iconURL: "https://cdn.discordapp.com/emojis/1506989509886218391.png",
        })
        .setTimestamp();

      if (imageUrl) embed.setImage(imageUrl);
      if (thumbnailUrl) embed.setThumbnail(thumbnailUrl);
      if (videoUrl) {
        embed.setURL(videoUrl).addFields({
          name: "🎬 Video",
          value: `[Bấm để xem video](${videoUrl})`,
          inline: false,
        });
      }

      await channel.send({
        content: [pingEveryone ? "@everyone" : null, videoUrl ? `🎬 ${videoUrl}` : null].filter(Boolean).join("\n") || null,
        embeds: [embed],
        allowedMentions: {
          parse: pingEveryone ? ["everyone"] : [],
        },
      });

      await interaction.editReply(`✅ Đã đăng thông báo vào ${channel}.`);
      return;
    }

    // =========================
    // APPROVE / REJECT BUTTON
    // =========================
    if (interaction.isButton()) {
      if (interaction.customId === "rr_ticket_support") {
        await createTicketChannel(interaction, "support");
        return;
      }

      if (interaction.customId === "rr_ticket_bug") {
        await createTicketChannel(interaction, "bug");
        return;
      }

      if (interaction.customId === "rr_ticket_close") {
        await closeTicket(interaction);
        return;
      }

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
