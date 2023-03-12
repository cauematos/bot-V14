const Discord = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Veja as informações do servidor",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "id",
      description: "Cole o ID do servidor",
      type: Discord.ApplicationCommandOptionType.String,
      require: true,
    },
  ],
  run: async (client, interaction) => {
    let membros = interaction.guild.memberCount;
    let cargos = interaction.guild.roles.cache.size;
    let canais = interaction.guild.channels.cache.size;
    let entrou = interaction.guild.joinedTimestamp;
    let servidor = interaction.guild;
    let donoid = interaction.guild.ownerId;
    let emojis = interaction.guild.emojis.cache.size;
    let serverid = interaction.options.getString("id");
    let impulsos = interaction.guild.premiumSubscriptionCount;
    let data = interaction.guild.createdAt.toLocaleDateString("pt-br");

    let bx = new Discord.EmbedBuilder()
      .setColor("Blue")
      .setThumbnail(
        interaction.guild.iconURL({ dinamyc: true, format: "png", size: 4096 })
      )
      .setTitle(`Informações do servidor: ${interaction.guild}`)
      .addFields(
        {
          name: `<:Svid_emoji:1049794809444974662> Identidade`,
          value: `\`\`\`${serverid}\`\`\``,
          inline: true,
        },
        {
          name: `ℹ️ Canais em geral:`,
          value: `<:gray_restrito_fdl:1049800614848249897> Canais: ${canais}\n<:gray_restrito_fdl:1049800614848249897> Cargos: ${cargos}`,
          inline: true,
        },
        {
          name: `<:iconthereeroles:1049796009443725353> Usuarios`,
          value: `\`\`\`${membros} membros\`\`\``,
          inline: true,
        },
        {
          name: `<:escudo:1049795226681737236> Servidor criado`,
          value: `<t:${parseInt(interaction.guild.createdTimestamp / 1000)}>`,
          inline: true,
        },
        {
          name: `<a:nitrobooster:1049797906410000495> ${interaction.user.username} entrou em `,
          value: `<t:${parseInt(servidor.joinedTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: `🎈 Emojis:`,
          value: `${emojis}`,
          inline: true,
        },
        {
          name: `🚀 Impulsos::`,
          value: `${impulsos}`,
          inline: true,
        },
        {
          name: `<:server_owner:1049795144758591498> Dono`,
          value: `<@!${donoid}> \n\`\`${donoid}\`\``,
          inline: true,
        }
      );

    interaction.reply({ embeds: [bx] });
  },
};
