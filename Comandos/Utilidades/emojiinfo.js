const Discord = require("discord.js");

module.exports = {
  name: "emoji-info",
  description: "Veja informações de um emoji.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "emoji",
      description: "Insira o nome exato do emoji.",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let emojiString = interaction.options.getString("emoji");
    let emoji =
      client.emojis.cache.find(
        (emoji) => `<:${emoji.name}:${emoji.id}>` === emojiString
      ) ||
      client.emojis.cache.find((emoji) => emoji.name === emojiString) ||
      client.emojis.cache.get(emojiString);

    if (!emoji) {
      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `**❌ - Não encontrei o emoji, siga o modelo abaixo**\n\`/emoji-info [nome]\``
            ),
        ],
      });
    } else if (emoji) {
      try {
        if (!emoji.animated) {
          let img = `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=2048`;
          let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setLabel("Download")
              .setEmoji("📎")
              .setURL(img)
          );

          let embed = new Discord.EmbedBuilder()
            .setColor("#0095ff")
            .setTitle("Informações do Emoji:")
            .setThumbnail(img)
            .addFields(
              {
                name: `> \📝 Nome do emoji:`,
                value: `\`${emoji.name}\``,
                inline: true,
              },
              {
                name: `> \🆔 ID do emoji:`,
                value: `\`${emoji.id}\``,
                inline: true,
              },
              {
                name: `> \🧿 Menção do emoji:`,
                value: `\`${emoji}\``,
                inline: true,
              },
              {
                name: `> \🖼 O emoji é:`,
                value: `\`Gif\``,
                inline: true,
              },
              {
                name: `> \📅 Criado em:`,
                value: `<t:${parseInt(emoji.createdTimestamp / 1000)}>`,
                inline: false,
              }
            );
          interaction.reply({ embeds: [embed], components: [botao] });
        } else if (emoji.animated) {
          let img = `https://cdn.discordapp.com/emojis/${emoji.id}.gif?size=2048`;
          let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setLabel("Download")
              .setEmoji("📎")
              .setURL(`${img}`)
          );

          let embed = new Discord.EmbedBuilder()
            .setColor("#0095ff")
            .setTitle("Informações do Emoji:")
            .setThumbnail(img)
            .addFields(
              {
                name: `\<:id:1050930441105985646> Nome do emoji:`,
                value: `\`${emoji.name}\``,
                inline: true,
              },
              {
                name: `\<:Svid_emoji:1049794809444974662> ID do emoji:`,
                value: `\`${emoji.id}\``,
                inline: true,
              },
              {
                name: `\🧿 Menção do emoji:`,
                value: `\`${emoji}\``,
                inline: true,
              },
              {
                name: `\📅 Criado em:`,
                value: `<t:${parseInt(emoji.createdTimestamp / 1000)}>`,
                inline: false,
              }
            );

          await interaction.reply({ embeds: [embed], components: [botao] });
        }
      } catch (e) {
        interaction.reply(
          `Houve um erro ao tentar utilizar esse comando, ${interaction.user}`
        );
      }
    }
  },
};
