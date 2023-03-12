const Discord = require("discord.js");

module.exports = {
  name: "painel-ticket",
  description: "Envie o painel de tikcet.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "chat",
      description: "Mencione um canal.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      )
    )
      return interaction.reply({
        content: `**❌ - ${interaction.user}, Você precisa da permissão \`Administrador\` para usar este comando!**`,
        ephemeral: true,
      });
    else {
      let chat = interaction.options.getChannel("chat");

      if (!chat.send)
        return interaction.reply({
          content: `**❌ - ${interaction.user}, Você provavelmente selecionou um canal de voz ou categoria. Por favor selecione um canal de texto.**`,
          ephemeral: true,
        });

      let rowTicket = new Discord.ActionRowBuilder().addComponents(
        new Discord.SelectMenuBuilder()
          .setCustomId("select2")
          .setPlaceholder("🎫 - selecionar Opção!")
          .addOptions(
            {
              label: " - Ticket",
              description:
                "Clique aqui para abrir o Ticket (Denúncias e Suporte Geral).",
              emoji: "🔨",
              value: "ticket",
            },
            {
              label: " - Tenho Dúvidas",
              description: "Clique aqui caso haja alguma dúvida.",
              emoji: "❔",
              value: "duvida",
            }
          )
      );

      let embedTicket = new Discord.EmbedBuilder()
        .setTitle(`💾 - Ticket`)
        .setDescription(`*Esta tendo algum problema com o servidor, viu alguem quebrando uma das regras do servidor? Então abra um ticket para que a nossa equipe possa te ajudar!*`)
        .setColor("Red")
        .setThumbnail(`${interaction.guild.iconURL()}`)
        .setImage(`https://cdn.discordapp.com/attachments/1043559404089376882/1071573845888208937/Picsart_23-02-04_20-30-49-381.jpg`);

      interaction.reply({
        content: `✅ - Feito! Ticket enviado no canal ${chat}!`,
        ephemeral: true,
      });
      chat.send({ components: [rowTicket], embeds: [embedTicket] });
    }
  },
};
