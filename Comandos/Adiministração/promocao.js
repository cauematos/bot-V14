const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    PermissionFlagsBits,
  } = require("discord.js");
  const ms = require("ms");
  
  module.exports = {
    name: "up",
    description: "setar cargo para um usuario.",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "canal",
        type: ApplicationCommandOptionType.Channel,
        description: "Selecione um canal",
        required: true,
      },
      {
        name: "usuario",
        type: ApplicationCommandOptionType.User,
        description: "Selecione um usuario",
        required: true,
      },
      {
        name: "cargo",
        description: "Selecione um cargo.",
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
    ],
  
    run: async (client, interaction) => {
      const { options, guild, member } = interaction;
      if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
          content: `**⛔ | ${interaction.user}, Você precisa da permissão \`MODERATE_MEMBERS\` para usar este comando!**`,
          ephemeral: true,
        });
      } else {
        const canal = options.getChannel("canal");
        const cargo = options.getRole("cargo");
        const user = options.getUser("usuario");
  
        const membro = guild.members.cache.get(user.id);
        const servericon = guild.iconURL({ dynamic: true });
  
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle(`**Nova Promoção**`)
          .setDescription(
            `> Usuário promovido: ${membro.user} \n\ > Cargo: ${cargo}`
          );

          guild.members.cache.forEach((membro) => {
            membro.roles.add(cargo);
          });
  
        const erro = new EmbedBuilder()
          .setColor("#38fc00")
          .setDescription(
            `❌ - Não foi possível promover o usuário ${membro} para o ${cargo}!`
          );
  
        interaction.reply({ embeds: [embed] }).catch((e) => {
          interaction.reply({ embeds: [erro] });
        });
  
        membro.send({
          embeds: [
            new EmbedBuilder()
              .setThumbnail(servericon)
              .setTitle(`👤 | **${membro.user.username}**`)
              .setColor("Red")
              .setTimestamp()
              .setFooter({ text: `Horario` })
              .setTimestamp()
              .setDescription(
                `**Olá ${membro.user} você acaba de ser promovido de cargo pelo ${interaction.user}.\n\n Parábens!!** `
              ),
          ],
        });
        canal.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle(`**Nova promoção**`)
              .setDescription(
                `> Usuário promovido: ${membro.user} \n\ > Cargo: ${cargo}`
              )
              .setTimestamp(),
          ],
        });
      }
    },
  };
  