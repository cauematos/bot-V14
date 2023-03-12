const Discord = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const DONO = "SEU ID AQUI";

module.exports = {
  name: "connect",
  description: "Conectar em um canal de voz.",
  options: [
    {
      name: "canal",
      description: "Coloque o canal de voz.",
      type: Discord.ApplicationCommandOptionType.Channel,
      channelTypes: [Discord.ChannelType.GuildVoice],
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (interaction.user.id !== DONO)
      return interaction.reply({
        content: `Apenas o meu dono pode utilizar este comando!`,
        ephemeral: true,
      });
    let canal = interaction.options.getChannel("canal");

    joinVoiceChannel({
      channelId: canal.id,
      guildId: canal.guild.id,
      adapterCreator: canal.guild.voiceAdapterCreator,
    });

    const embed = new Discord.EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `**${interaction.user.username}, conectei no canal de voz: ${canal}**`
      );
    interaction.reply({ embeds: [embed] });
  },
};
