const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "registro",
  description: "painel-registro",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "selecione um canal",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "cargo1",
      description: "escolha o cargo de Homem",
      type: Discord.ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "cargo2",
      description: "escolha o cargo de Mulher",
      type: Discord.ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "cargo3",
      description: "escolha o cargo de +18",
      type: Discord.ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "cargo4",
      description: "escolha o cargo de -18",
      type: Discord.ApplicationCommandOptionType.Role,
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

      let cargo1 = interaction.options.getRole("cargo1");
      await db.set(`cargo1_${interaction.guild.id}`, cargo1.id);

      let cargo2 = interaction.options.getRole("cargo2");
      await db.set(`cargo2_${interaction.guild.id}`, cargo2.id);

      let cargo3 = interaction.options.getRole("cargo3");
      await db.set(`cargo3_${interaction.guild.id}`, cargo3.id);

      let cargo4 = interaction.options.getRole("cargo4");
      await db.set(`cargo4_${interaction.guild.id}`, cargo4.id);

      const embed2 = new Discord.EmbedBuilder()
        .setColor("Random")
        .setDescription(
          `Sistema ativado com sucesso!\n\nCanal selecionado: ${canal}\nCargo Homem: ${cargo1}\nCargo Mulher: ${cargo2}\nCargo +18: ${cargo3}\nCargo -18: ${cargo4}`
        );

      interaction.reply({ embeds: [embed2], ephemeral: true });

      const embed = new Discord.EmbedBuilder()
        .setTitle("Registro - System")
        .setColor("Random")
        .setDescription(`Clique nos botões abaixo para fazer seu registro!`);

      const botao = new Discord.ActionRowBuilder()
        .addComponents([
          new Discord.ButtonBuilder()
            .setCustomId("homem")
            .setLabel("Homem")
            .setEmoji("🥷🏻")
            .setStyle(Discord.ButtonStyle.Success),
        ])
        .addComponents([
          new Discord.ButtonBuilder()
            .setCustomId("mulher")
            .setLabel("Mulher")
            .setEmoji("👩🏻")
            .setStyle(Discord.ButtonStyle.Primary),
        ])
        .addComponents([
          new Discord.ButtonBuilder()
            .setCustomId("+18")
            .setLabel("+18")
            .setEmoji("🍺")
            .setStyle(Discord.ButtonStyle.Danger),
        ])
        .addComponents([
          new Discord.ButtonBuilder()
            .setCustomId("-18")
            .setLabel("-18")
            .setEmoji("🧃")
            .setStyle(Discord.ButtonStyle.Secondary),
        ]);

      canal.send({ embeds: [embed], components: [botao] });
    }
  },
};
