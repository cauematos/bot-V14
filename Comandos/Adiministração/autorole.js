const Discord = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  name: "autorole",
  description: "Setar o cargo automatico ao entrar no discord",
  type: Discord.ApplicationCommandOptionType.ChatInput,

  options: [
    {
      name: "cargo",
      description: "Escolha o cargo que ira ser setado.",
      type: Discord.ApplicationCommandOptionType.Role,
    },
  ],

  run: async (client, interaction, args) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      )
    ) {
      interaction.reply(`Você não possui a permissão para usar este comando.`);
    } else {
      let role = interaction.options.getRole("cargo");

      await db.set("cargoauto", { role });

      let embedcargoauto = new Discord.EmbedBuilder()
        .setDescription(
          `**✅ - ${role} setado para Cargo de AutoRole**`
        )
        .setColor("Random")
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
        });

        interaction.reply({ embeds: [embedcargoauto] });
    }
  },
};
