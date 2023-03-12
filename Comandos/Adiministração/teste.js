const Discord = require('discord.js');

module.exports = {
  name: "painel-pagina", // Coloque o nome do comando
  description: "[ADM] painel-paginação", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "selecione um canal",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      )
    ) {
      interaction.reply({
        content: `Você não possui permissão para usar este comando!`,
        ephemeral: true,
      });
    } else {
      let canal = interaction.options.getChannel("canal");

      if (canal.type !== Discord.ChannelType.GuildText) {
        interaction.reply({
          content: `Você não possui permissão para usar este comando!`,
          ephemeral: true,
        });
      } else {
        const embed1 = new Discord.EmbedBuilder()
          .setColor("Random")
          .setDescription(`sistema ativado com sucesso!`);

        interaction.reply({ embeds: [embed1], ephemeral: true });

        const embed2 = new Discord.EmbedBuilder()
          .setTitle("Testando Paginas")
          .setColor("Red")
          .setDescription(`Clique no botão para ir passando as paginas!`);

        const botao = new Discord.ActionRowBuilder().addComponents([
          new Discord.ButtonBuilder()
            .setCustomId("botao2")
            .setLabel("➡️")
            .setStyle(Discord.ButtonStyle.Primary),
        ]);

        canal.send({ embeds: [embed2], components: [botao] });
      }
    }
  },
};
