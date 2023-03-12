const Discord = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kicke um usuario do discord",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Selecione um usuario",
      type: Discord.ApplicationCommandOptionType.User,
      require: true,
    },
    {
      name: "motivo",
      description: "Defina um motivo para kickar o usuario",
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
      interaction.reply({
        content: `Ola ${interaction.user}, Você não tem permissão para utilizar esse comando`,
        ephemeral: true,
      });
    } else {
      let user = interaction.options.getUser("user");
      let user2 = interaction.guild.members.cache.get(user.id);
      let motivo = interaction.options.getString("motivo");
      if (!motivo) motivo = "Não definido";
      if (!user)
        return interaction.reply({
          content: "Insira um id ou usuário válido",
          ephemeral: true,
        });

      let ryan = new Discord.EmbedBuilder()
      .setColor("#000000")
      .setFooter({ text: `Usuario expulso com sucesso!` })
      .setTimestamp()
      .setThumbnail(`${avatar}`)
      .setDescription(`
:hammer: **Modederador** 
${interaction.user}

:bust_in_silhouette: Usuário
${user}

<:Svid_emoji:1049794809444974662> **ID do usuário:** 
${user.id}

:clipboard: **Motivo**
${motivo}
`);

      user2.kick({ reason: [motivo] }).then(() => {
        interaction.reply({ embeds: [ryan] });
      });
    }
  },
};
