import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from "discord.js";

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
      await member.send(`✅ Bạn đã được duyệt whitelist\nLý do: ${reason}`);

      await interaction.editReply("✅ Approved + Role given");
    }

    if (action === "reject") {
      await db.execute(
        "UPDATE whitelist_applications SET status='rejected' WHERE id=?",
        [id]
      );

      const member = await interaction.guild.members.fetch(discordId);

      await member.send(`❌ Bạn đã bị từ chối whitelist\nLý do: ${reason}`);

      await interaction.editReply("❌ Rejected");
    }

    // 🔥 UPDATE MESSAGE (KHÓA NÚT + HIỆN NGƯỜI DUYỆT)

    const original = interaction.message;

    await original.edit({
      components: [], // ❌ remove buttons
      content: `✅ Processed by ${interaction.user.tag}\nReason: ${reason}`
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
