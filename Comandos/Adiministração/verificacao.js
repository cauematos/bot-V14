const Discord = require("discord.js");

module.exports = {
  name: "painel-verificacao",
  description: "Ative o sistema de ticket no servidor.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "Mencione um canal de texto.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.ManageGuild
      )
    ) {
      interaction.reply(
        `Olá ${interaction.user}, você não possui permissão para utilizar este comando.`
      );
    } else {
      let canal = interaction.options.getChannel("canal");
      if (!canal) canal = interaction.channel;

      let embed_ephemeral = new Discord.EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `Olá ${interaction.user}, o sistema de verificação foi adicionado em ${canal} com sucesso.`
        );

      let emebd_tickets = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({
          name: "Verifique-se - Complexo da Coreia™",
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setDescription(
          `Nosso sistema de verificação foi feito com o intuito de evitar pessoas que utilizam fotos fakes.\n
          **Como funciona?**\n
          ・ Para ter acesso a postar fotos no Instagram você terá que passar por uma Verificação que é feita por nossa equipe, para iniciar a verificação clique no botão abaixo.`
        )

      let botao = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("tickets_basico")
          .setLabel("Iniciar Verificação")
          .setEmoji("<:certored:1071615196537311283>")
          .setStyle(Discord.ButtonStyle.Secondary)
      );

      interaction
        .reply({ embeds: [embed_ephemeral], ephemeral: true })
        .then(() => {
          canal.send({ embeds: [emebd_tickets], components: [botao] });
        });
    }
  },
};
