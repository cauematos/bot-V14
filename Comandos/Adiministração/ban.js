const Discord = require("discord.js");

module.exports = {
  name: "banir",
  description: "Banir um usuário do seu servidor",
  type: Discord.ApplicationCommandType.ChatInput,

  options: [
    {
      name: "usuario",
      description: "Mencione alguém para ser banido.",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "motivo",
      description: "Insira um motivo do banimento (opcional)",
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
        `Você não possui a permissão para **BANIR** membros.`
      );
    } else {
      let userr = interaction.options.getUser("usuario");
      let user = interaction.guild.members.cache.get(userr.id);
      let motivo = interaction.options.getString("motivo");
      let avatar = user.displayAvatarURL({
        dynamic: true,
        format: "png",
      });

      if (!motivo) motivo = "Não informado.";

      if (!user)
        return interaction.reply({
          content: "Insira um id ou usuário válido",
          ephemeral: true,
        });

      let embed = new Discord.EmbedBuilder()

        .setColor("#000000")
        .setFooter({ text: `Usuario banido com sucesso!` })
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

      let erro = new Discord.EmbedBuilder()

        .setColor("#ff0000")

        .setDescription(
          `Não foi possível banir o usuário ${user} (\`${user.id}\`) do seu servidor!`
        );

      user
        .ban({ reason: [motivo] })
        .then(() => {
          interaction.reply({ embeds: [embed] });
        })
        .catch((e) => {
          interaction.reply({ embeds: [erro] });
        });
    }
  },
};
