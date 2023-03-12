const ms = require("ms");
const Discord = require("discord.js");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "mensagem-automatica",
  description: "Configure a mensagem automatica.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "Selecione um canal.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "mensagem",
      description: "Coloque a mensagem que será enviada.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "tempo",
      description: "Selecione um tempo para o vip.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "10 Segundos",
          value: "10000",
        },
        {
          name: "30 Segundos",
          value: "30000",
        },
        {
          name: "1 Minuto",
          value: "100000",
        },
        {
          name: "5 Minuto",
          value: "500000",
        },
        {
          name: "10 Minuto",
          value: "1000000",
        },
        {
          name: "20 Minuto",
          value: "2000000",
        },
        {
          name: "30 Minuto",
          value: "3000000",
        },
        {
          name: "40 Minuto",
          value: "4000000",
        },
        {
          name: "1 Hora",
          value: "10000000",
        },
        {
          name: "2 Hora",
          value: "20000000",
        },
        {
          name: "3 Hora",
          value: "30000000",
        },
        {
          name: "5 Hora",
          value: "50000000",
        },
        {
          name: "10 Hora",
          value: "100000000",
        },
        {
          name: "1 Dia",
          value: "240000000",
        },
      ],
    },
    {
      name: "parar-mensagem",
      description: "Selecione o tempo em que a mensagem será parada.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "10 Segundos",
          value: "10009",
        },
        {
          name: "30 Segundos",
          value: "30009",
        },
        {
          name: "1 Minuto",
          value: "100009",
        },
        {
          name: "5 Minuto",
          value: "500009",
        },
        {
          name: "10 Minuto",
          value: "1000009",
        },
        {
          name: "20 Minuto",
          value: "2000009",
        },
        {
          name: "30 Minuto",
          value: "3000009",
        },
        {
          name: "40 Minuto",
          value: "4000009",
        },
        {
          name: "1 Hora",
          value: "10000009",
        },
        {
          name: "2 Hora",
          value: "20000009",
        },
        {
          name: "3 Hora",
          value: "30000009",
        },
        {
          name: "5 Hora",
          value: "50000009",
        },
        {
          name: "10 Hora",
          value: "100000009",
        },
        {
          name: "1 Dia",
          value: "240000009",
        },
        {
          name: "2 Dia",
          value: "480000009",
        },
        {
          name: "3 Dia",
          value: "720000009",
        },
        {
          name: "5 Dia",
          value: "1200000009",
        },
        {
          name: "8 Dia",
          value: "1920000009",
        },
        {
          name: "12 Dia",
          value: "2880000009",
        },
        {
          name: "18 Dia",
          value: "4320000009",
        },
        {
          name: "25 Dia",
          value: "6000000009",
        },
      ],
    },
  ],

  run: async (client, interaction, member, guild, options) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.ManageGuild
      )
    ) {
      return interaction.reply({
        content: `Você não possui permissão para utilizar esse comando.`,
        ephemeral: true,
      });
    } else {
      const mensagem = interaction.options.getString("mensagem");
      const canal = interaction.options.getChannel("canal");
      const tempo = interaction.options.getString("tempo");
      const duracao = ms(tempo);
      const tempo1 = interaction.options.getString("parar-mensagem");
      const duracao1 = ms(tempo1);

      interaction.reply({
        content: `**Mensagem automatica configurada.**`,
        ephemeral: true,
      });

      let embed = new Discord.EmbedBuilder()
        .setColor("Random")
        .setDescription(`${mensagem}`)
        .setTimestamp(new Date());

      const interval = setInterval(function () {
        canal.send({ embeds: [embed] });
      }, duracao);

      setTimeout(function () {
        clearInterval(interval);
      }, duracao1);
    }
  },
};
