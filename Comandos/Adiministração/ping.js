const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Veja o ping do bot em tempo real.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    let ping = client.ws.ping;

    let embed_1 = new Discord.EmbedBuilder()

      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `Olá ${interaction.user}, meu ping está em \`calculando...\`.`
      )
      .setColor("#0095ff");

    let embed_2 = new Discord.EmbedBuilder()

      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTitle("**__Ping Calculado__**")
      .setDescription(
        `Olá ${interaction.user}, meu ping está em \`${ping}ms\`.`
      )
      .setColor("#0095ff")
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    interaction.reply({ embeds: [embed_1] }).then(() => {
      setTimeout(() => {
        interaction.editReply({ embeds: [embed_2] });
      }, 3000);
    });
  },
};
