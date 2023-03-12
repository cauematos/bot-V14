const {
  EmbedBuilder,
  ApplicationCommand,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");
const { constants } = require("fs");

module.exports = {
  name: "banner",
  description: "Veja o banner de um usuário",
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: "user",
      description: "Selecione um usuário, ou envie um ID",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    let userBanner = interaction.options.getUser("user") || interaction.user;

    axios
      .get(`https://discord.com/api/users/${userBanner.id}`, {
        headers: {
          Authorization: `Bot ${client.token}`,
        },
      })
      .then((res) => {
        const { banner } = res.data;

        if (banner) {
          const extension = banner.startsWith("a_")
            ? ".gif?size=4096"
            : ".png?size=4096";
          const url = `https://cdn.discordapp.com/banners/${userBanner.id}/${banner}${extension}`;

          let embedBanner = new EmbedBuilder()
            .setColor("#0095ff")
            .setTitle(`<:imagens:1069727433080705146>ㅤBanner de - ${userBanner.username}`)
            .setImage(url);

          interaction.reply({
            embeds: [embedBanner],
          });
        } else {
          interaction.reply({
            content: `<:error:1050431019351814174> | ${userBanner} não utiliza banner no perfil!`,
            ephemeral: true,
          });
        }
      });
  },
};
