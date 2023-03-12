const Discord = require("discord.js");

module.exports = {
  name: "say-embed",
  description: "fale pelo bot (configuravel)",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "mensagem",
      description: "escreva uma mensagem",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "titulo",
      description: "selecione o titulo da embed",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "cor",
      description: "selecione a cor da embed (hexadecimal)",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "canal",
      description: "selecione um canal",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "log",
      description: "log da mensagem (opcional)",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: false,
    },
    {
      name: "usuario",
      description: "author da mensagem (para a log)",
      type: Discord.ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      )
    ) {
      interaction.reply({
        content: `Você não tem permissão para usar este comando!`,
        ephemeral: true,
      });
    } else {
      let msg = interaction.options.getString("mensagem");
      let titulo = interaction.options.getString("titulo");
      let cor = interaction.options.getString("cor");
      let canal = interaction.options.getChannel("canal");
      let log = interaction.options.getChannel("log");
      let user = interaction.options.getUser("usuario");

      const embed = new Discord.EmbedBuilder()
        .setTitle(`${titulo}`)
        .setColor(`${cor}`)
        .setDescription(`${msg}`)
        .setThumbnail();

      canal
        .send({ embeds: [embed], content: `@everyone` })
        .then(() => {
          let emb = new Discord.EmbedBuilder()
            .setColor("Random")
            .setDescription(`Mensagem enviada com sucesso!`);

          interaction.reply({ embeds: [emb], ephemeral: true });
        })
        .catch((e) => {
          let emb1 = new Discord.EmbedBuilder()
            .setColor("Random")
            .setDescription(
              `Houve algum erro ao enviar a mensagem em ${canal}`
            );

          interaction.reply({ embed: [emb1], ephemeral: true });
        });

      log.send({ embeds: [embed], content: `Nova mensagem de ${user} !` });
    }
  },
};
