const Discord = require("discord.js");
const moment = require("moment");
module.exports = {
  name: "botinfo",
  description: "Veja as minhas informações",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, args) => {
    let server_suporte = "https://discord.gg/YvAZjvTPaq";
    let me_adicione = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`;
    let servidor = client.guilds.cache.size;
    let usuarios = client.users.cache.size;
    let canais = client.channels.cache.size;
    let ping = client.ws.ping;
    let dono_id = "854126213513609236";
    let dono = client.users.cache.get(dono_id);
    let prefixo = "/";
    let versao = `^${require("discord.js").version.slice(0, 6)}`;

    let embed = new Discord.EmbedBuilder()
      .setColor("#0095ff")
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setDescription(
        `<:emoji_23:1069397277468278865> Olá ${interaction.user}, Eu me chamo ${client.user.username}, meu prefixo é \`${prefixo}\`.
<:calendario:1069726967785599067> Eu nasci <t:${moment(
          client.user.createdTimestamp
        ).unix()}>(<t:${~~(new Date(client.user.createdAt) / 1000)}:R>)
<:timer:1069727088233427086> Quando entrei aqui: <t:${moment(
          client.joinedAt
        ).unix()}>
<:SlashCommands:1069716748280025198> Veja meus comandos usando \`${prefixo}help\`.
<:LKS_config:1049795709618114631> Atualmente estou gerenciando \`${servidor}\` servidores, \`${usuarios}\` usuários e \`${canais}\` canais de servidores.
<:ping:1069718197827285012> Meu ping está em \`${ping}\` ms.
<:server_owner:1049795144758591498> Fui criada pelo \`${dono.tag}\`.
<:nodejs:1069714090416685106> Na linguagem JavaScript, utilizando NodeJs e a livraria Discord.Js na versão \`${versao}\`.

**Miscellaneous:**`
      )
      .addFields({
        name: "<:memoria:1069726827863617686> Memória usada",
        value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )}MB\``,
      });
    interaction.reply({
      embeds: [embed],
      components: [
        new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setStyle(5)
            .setLabel("Suporte")
            .setURL(server_suporte),
          new Discord.ButtonBuilder()
            .setStyle(5)
            .setLabel("Me Adicione")
            .setURL(me_adicione)
        ),
      ],
    });
  },
};
