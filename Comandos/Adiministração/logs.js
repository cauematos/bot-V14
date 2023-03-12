const Discord = require("discord.js");
const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { PermissionFlagsBits } = require("discord.js");
module.exports = {
  name: "logs",
  description: "⚙️Configuração| Configurar canal de logs de ban.",
  options: [
    {
      name: "ban",
      description: "⚙️Configuração| Configurar canal de logs de ban.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "canal",
          type: ApplicationCommandOptionType.Channel,
          description: "canal que sera usado como logs de ban.",
          required: true,
        },
      ],
    },
    {
      name: "call",
      description: "⚙️Configuração| Configurar canal de logs de call.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "canal",
          type: ApplicationCommandOptionType.Channel,
          description: "canal que sera usado como logs de call.",
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction, args) => {
    const subcommand = args;
    const canalban = interaction.options.getChannel("canal");
    const logscall = interaction.options.getChannel("canal");

    if (subcommand === "ban") {
      if (
        !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      )
        return interaction.reply({
          content: `**Você não possui permissão pra utilizar este comando!**`,
          ephemeral: true,
        });
      let embed1 = new EmbedBuilder()
        .setTitle(`:emoji_40: |${interaction.guild.name} - Config logs ban`)
        .setDescription(
          `A configuração do canal de logs de ban foi concluida com sucesso\n**Canal Configurado:** ${canalban}`
        )
        .setColor("#010101")
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp(new Date());

      await db.set(`channelban_${interaction.guild.id}`, canalban.id);

      interaction.reply({ embeds: [embed1], ephemeral: true });
    }
    if (subcommand === "call") {
      if (
        !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      )
        return interaction.reply({
          content: `**Você não possui permissão pra utilizar este comando!**`,
          ephemeral: true,
        });
      let embed1 = new EmbedBuilder()
        .setTitle(`:emoji_40: |${interaction.guild.name} - Config logs call`)
        .setDescription(
          `A configuração do canal de logs de call foi concluida com sucesso\n**Canal Configurado:** ${logscall}`
        )
        .setColor("#010101")
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp(new Date());

      await db.set(`logscallchannel_${interaction.guild.id}`, logscall.id);

      interaction.reply({ embeds: [embed1], ephemeral: true });
    }
  },
};
