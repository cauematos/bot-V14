const Discord = require("discord.js");

module.exports = {
  name: "unban",
  description: "Desbanir um usuário.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Mencione um usuário para ser desbanido.",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "motivo",
      description: "Coleque o motivo do desbanimento.",
      type: Discord.ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.BanMembers
      )
    ) {
      interaction.reply(
        `Você não possui poermissão para utilizar este comando.`
      );
    } else {
      let user = interaction.options.getUser("user");
      let motivo = interaction.options.getString("motivo");
      if (!motivo) motivo = "Não definido.";

      let embed = new Discord.EmbedBuilder().setColor("#000000").setDescription(`
        Usuário desbanido: (${user}) 
        Id do Usuário: (\`${user.id}\`)
        Desbanido por: (${interaction.user})`);

      let erro = new Discord.EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `Não foi possível desbanir o usuário ${user} (\`${user.id}\`) do servidor!`
        );

      interaction.guild.members
        .unban(user.id, motivo)
        .then(() => {
          interaction.reply({ embeds: [embed] });
        })
        .catch((e) => {
          interaction.reply({ embeds: [erro] });
        });
    }
  },
};
