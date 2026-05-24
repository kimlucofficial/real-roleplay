import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} from "discord.js";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "path";
import { fileURLToPath } from "url";

import { getDb } from "../lib/db.js";

const db = getDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
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



const ticketPanelCommand = new SlashCommandBuilder()
  .setName("ticketpanel")
  .setDescription("Tạo bảng mở ticket Real Roleplay")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption((option) =>
    option
      .setName("kenh")
      .setDescription("Kênh sẽ đăng bảng ticket")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  );

function getEnvId(name) {
  const value = process.env[name];
  return isValidSnowflake(value) ? value : null;
}

async function buildWelcomeAttachment(member) {
  const bannerPath = path.join(rootDir, "public", "welcome-banner.png");
  const background = await loadImage(bannerPath);
  const canvas = createCanvas(background.width, background.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  const avatarUrl = member.user.displayAvatarURL({ extension: "png", size: 512, forceStatic: true });
  const avatar = await loadImage(avatarUrl);

  // Vị trí vòng tròn logo trên banner 1664x936. Tự scale theo kích thước ảnh gốc.
  const scaleX = canvas.width / 1664;
  const scaleY = canvas.height / 936;
  const centerX = 1228 * scaleX;
  const centerY = 386 * scaleY;
  const radius = 137 * Math.min(scaleX, scaleY);

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, centerX - radius, centerY - radius, radius * 2, radius * 2);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 10 * Math.min(scaleX, scaleY), 0, Math.PI * 2);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 12 * Math.min(scaleX, scaleY);
  ctx.shadowColor = "rgba(212,175,55,.8)";
  ctx.shadowBlur = 18 * Math.min(scaleX, scaleY);
  ctx.stroke();
  ctx.restore();

  return new AttachmentBuilder(await canvas.encode("png"), { name: "real-roleplay-welcome.png" });
}

async function findOrCreateTicketCategory(guild, type) {
  const envName = type === "bug" ? "TICKET_BUG_CATEGORY_ID" : "TICKET_SUPPORT_CATEGORY_ID";
  const envId = getEnvId(envName);
  if (envId) {
    const found = guild.channels.cache.get(envId) || await guild.channels.fetch(envId).catch(() => null);
    if (found && found.type === ChannelType.GuildCategory) return found;
  }

  const wantedName = type === "bug" ? "Báo lỗi" : "Support";
  const existing = guild.channels.cache.find(
    (channel) => channel.type === ChannelType.GuildCategory && channel.name.toLowerCase() === wantedName.toLowerCase()
  );
  if (existing) return existing;

  return guild.channels.create({
    name: wantedName,
    type: ChannelType.GuildCategory,
  });
}

function makeTicketPanelPayload() {
  const embed = new EmbedBuilder()
    .setColor(0xd4af37)
    .setAuthor({ name: "REAL ROLEPLAY • TICKET CENTER" })
    .setTitle("🎫 Trung Tâm Hỗ Trợ")
    .setDescription([
      "Bạn cần hỗ trợ vấn đề gì? Nhấn đúng nút bên dưới để mở ticket vào đúng category.",
      "",
      "🛡️ **Support**",
      "Hỗ trợ chung, hỏi đáp, khiếu nại, tài khoản, whitelist hoặc vấn đề cần Staff xử lý.",
      "",
      "🐞 **Báo lỗi**",
      "Báo bug server, lỗi script, lỗi website/bot hoặc lỗi trong quá trình trải nghiệm.",
      "",
      "Vui lòng không spam ticket và ghi rõ nội dung kèm ảnh/video nếu có."
    ].join("\n"))
    .setFooter({ text: "Real Roleplay • Ticket System" })
    .setTimestamp();

  const supportButton = new ButtonBuilder()
    .setCustomId("rr_ticket_support")
    .setLabel("Support")
    .setEmoji("🛡️")
    .setStyle(ButtonStyle.Primary);

  const bugButton = new ButtonBuilder()
    .setCustomId("rr_ticket_bug")
    .setLabel("Báo lỗi")
    .setEmoji("🐞")
    .setStyle(ButtonStyle.Danger);

  return { embeds: [embed], components: [new ActionRowBuilder().addComponents(supportButton, bugButton)] };
}

async function createTicketChannel(interaction, type) {
  const guild = interaction.guild;
  const member = interaction.member;
  const category = await findOrCreateTicketCategory(guild, type);
  const prefix = type === "bug" ? "bao-loi" : "support";
  const existing = guild.channels.cache.find(
    (channel) => channel.type === ChannelType.GuildText && channel.name.includes(interaction.user.id.slice(-6))
  );

  if (existing) {
    await interaction.reply({ content: `⚠️ Bạn đang có ticket mở: ${existing}`, ephemeral: true });
    return;
  }

  const channel = await guild.channels.create({
    name: `${prefix}-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 80) + `-${interaction.user.id.slice(-6)}`,
    type: ChannelType.GuildText,
    parent: category.id,
    permissionOverwrites: [
      { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles] },
      { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ReadMessageHistory] },
    ],
  });

  const staffRoleId = getEnvId("TICKET_STAFF_ROLE_ID");
  if (staffRoleId) {
    await channel.permissionOverwrites.edit(staffRoleId, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      ManageMessages: true,
    }).catch(() => null);
  }

  const closeButton = new ButtonBuilder()
    .setCustomId("rr_ticket_close")
    .setLabel("Đóng ticket")
    .setEmoji("🔒")
    .setStyle(ButtonStyle.Danger);

  const embed = new EmbedBuilder()
    .setColor(type === "bug" ? 0xef4444 : 0xd4af37)
    .setTitle(type === "bug" ? "🐞 Ticket Báo Lỗi" : "🛡️ Ticket Support")
    .setDescription([
      `${interaction.user}, Staff sẽ hỗ trợ bạn tại đây.`,
      "",
      "Vui lòng gửi đầy đủ thông tin:",
      "• Nội dung cần hỗ trợ / lỗi gặp phải",
      "• Ảnh hoặc video nếu có",
      "• Thời gian xảy ra lỗi nếu là báo bug"
    ].join("\n"))
    .setFooter({ text: "Real Roleplay • Ticket System" })
    .setTimestamp();

  await channel.send({
    content: `${interaction.user}${staffRoleId ? ` <@&${staffRoleId}>` : ""}`,
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(closeButton)],
    allowedMentions: { users: [interaction.user.id], roles: staffRoleId ? [staffRoleId] : [] },
  });

  await interaction.reply({ content: `✅ Đã tạo ticket: ${channel}`, ephemeral: true });
}

async function registerSlashCommands() {
  try {
    if (process.env.DISCORD_GUILD_ID) {
      const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
      await guild.commands.set([announcementCommand.toJSON(), ticketPanelCommand.toJSON()]);
      console.log("✅ Đã đăng ký slash command /thongbao cho guild.");
      return;
    }

    await client.application.commands.set([announcementCommand.toJSON(), ticketPanelCommand.toJSON()]);
    console.log("✅ Đã đăng ký slash command /thongbao global.");
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

  // Nếu muốn bot tự đăng panel ticket khi khởi động, điền TICKET_PANEL_CHANNEL_ID trên Railway.
  const panelChannelId = getEnvId("TICKET_PANEL_CHANNEL_ID");
  if (panelChannelId) {
    try {
      const channel = await client.channels.fetch(panelChannelId);
      if (channel?.type === ChannelType.GuildText) {
        await channel.send(makeTicketPanelPayload());
        console.log("✅ Đã đăng ticket panel tự động.");
      }
    } catch (err) {
      console.log("Không đăng được ticket panel tự động:", err?.message || err);
    }
  }
});

client.on("guildMemberAdd", async (member) => {
  const welcomeChannelId = getEnvId("WELCOME_CHANNEL_ID");
  if (!welcomeChannelId) return;

  try {
    const channel = await member.guild.channels.fetch(welcomeChannelId);
    if (!channel || channel.type !== ChannelType.GuildText) return;

    const attachment = await buildWelcomeAttachment(member);
    const memberCount = member.guild.memberCount?.toLocaleString("vi-VN") || "?";

    const embed = new EmbedBuilder()
      .setColor(0xd4af37)
      .setTitle("👋 Welcome to Real Roleplay")
      .setDescription([
        `Chào mừng ${member} đã đến với **Real Roleplay**!`,
        `Bạn là cư dân thứ **#${memberCount}** của server.`,
        "Chúc bạn có những giây phút Roleplay tuyệt vời tại thành phố."
      ].join("\n"))
      .setImage("attachment://real-roleplay-welcome.png")
      .setFooter({ text: "Real Roleplay • Welcome System" })
      .setTimestamp();

    await channel.send({
      content: `🎉 Chào mừng ${member} đến với **Real Roleplay**!`,
      embeds: [embed],
      files: [attachment],
      allowedMentions: { users: [member.id] },
    });
  } catch (err) {
    console.log("Không gửi được welcome:", err?.message || err);
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    // =========================
    // /THONGBAO COMMAND
    // =========================
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
    // /TICKETPANEL COMMAND
    // =========================
    if (interaction.isChatInputCommand() && interaction.commandName === "ticketpanel") {
      await interaction.deferReply({ ephemeral: true });

      const channel = interaction.options.getChannel("kenh");
      if (!channel || channel.type !== ChannelType.GuildText) {
        await interaction.editReply("❌ Kênh không hợp lệ. Chỉ được chọn kênh chữ.");
        return;
      }

      await channel.send(makeTicketPanelPayload());
      await interaction.editReply(`✅ Đã tạo bảng ticket tại ${channel}.`);
      return;
    }

    // =========================
    // TICKET BUTTON / CLOSE
    // =========================
    if (interaction.isButton() && ["rr_ticket_support", "rr_ticket_bug"].includes(interaction.customId)) {
      const type = interaction.customId === "rr_ticket_bug" ? "bug" : "support";
      await createTicketChannel(interaction, type);
      return;
    }

    if (interaction.isButton() && interaction.customId === "rr_ticket_close") {
      await interaction.reply({ content: "🔒 Ticket sẽ được đóng sau 5 giây.", ephemeral: true });
      setTimeout(() => {
        interaction.channel?.delete("Real Roleplay ticket closed").catch(() => null);
      }, 5000);
      return;
    }

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
