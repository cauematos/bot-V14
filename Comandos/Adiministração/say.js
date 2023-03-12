const Discord = require("discord.js");

module.exports = {
  name: "say",
  description: "Faça eu falar",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "embed",
      description: "Mensagem em embed.",
      type: Discord.ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "normal",
      description: "Menssagem normal.",
      type: Discord.ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.ManageMessages
      )
    ) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      let embed_fala = interaction.options.getString("embed");
      let normal_fala = interaction.options.getString("normal");

      if (!embed_fala && !normal_fala) {
        interaction.reply(`Escreva em uma das opções.`);
      } else {
        if (!embed_fala) embed_fala = "⠀";
        if (!normal_fala) normal_fala = "⠀";

        let embed = new Discord.EmbedBuilder()
          .setColor("#0095ff")
          .setDescription(embed_fala);

        if (embed_fala === "⠀") {
          interaction.reply({ content: ` mensagem enviada!`, ephemeral: true });
          interaction.channel.send({ content: `${normal_fala}` });
        } else if (normal_fala === "⠀") {
          interaction.reply({ content: ` mensagem enviada!`, ephemeral: true });
          interaction.channel.send({ embeds: [embed] });
        } else {
          interaction.reply({ content: ` mensagem enviada!`, ephemeral: true });
          interaction.channel.send({
            content: `${normal_fala}`,
            embeds: [embed],
          });
        }
      }
    }
  },
};
