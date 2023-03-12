const Discord = require("discord.js");
const config = require("./config.json");
const discordTranscripts = require("discord-html-transcripts");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const client = new Discord.Client({
  intents: [Discord.GatewayIntentBits.Guilds],
});

module.exports = client;

client.on("interactionCreate", (interaction) => {
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    const cmd = client.slashCommands.get(interaction.commandName);

    if (!cmd) return interaction.reply(`Error`);

    interaction["member"] = interaction.guild.members.cache.get(
      interaction.user.id
    );

    cmd.run(client, interaction);
  }
});

client.on("ready", () => {
  console.log(`✅ BOT ON`);
});

client.slashCommands = new Discord.Collection();

require("./handler")(client);

client.login(config.token);

//COMANDO DE TICKET

client.on("interactionCreate", async (interaction) => {
  if (interaction.isSelectMenu()) {
    let choice = interaction.values[0];
    const member = interaction.member;
    const guild = interaction.guild;
    if (choice == "duvida") {
      let embedDuvida = new Discord.EmbedBuilder()
        .setColor("Random")
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
        })
        .setDescription(
          `- **Caso haja alguma dúvida em relação ao Ticket, abra ele e nós vamos retira-la!**`
        );
      interaction.reply({ embeds: [embedDuvida], ephemeral: true });
    } else if (choice == "ticket") {
      if (
        interaction.guild.channels.cache.find(
          (ca) => ca.name === `ticket-${member.id}`
        )
      ) {
        let canal = interaction.guild.channels.cache.find(
          (ca) => ca.name === `ticket-${member.id}`
        );

        let jaTem = new Discord.EmbedBuilder()
          .setDescription(
            `❌ **Calma! Você já tem um ticket criado em: ${canal}.**`
          )
          .setColor("Red");

        interaction.reply({ embeds: [jaTem], ephemeral: true });
      } else {
        let cargoTicket = await db.get("cargoModerate.cargoM"); //Cargo dos STAFF's
        let CategoriaTicket = await db.get("Categoria.Categoria"); //Categoria que o Ticket será criado

        guild.channels
          .create({
            name: `ticket-${member.id}`,
            type: 0,
            parent: `${CategoriaTicket.id}`, //Categoria
            topic: interaction.user.id,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: ["ViewChannel"],
              },
              {
                id: member.id,
                allow: [
                  "ViewChannel",
                  "SendMessages",
                  "AddReactions",
                  "AttachFiles",
                ],
              },
              {
                id: cargoTicket.id, //Cargo STAFF
                allow: [
                  "ViewChannel",
                  "SendMessages",
                  "AddReactions",
                  "AttachFiles",
                  "ManageMessages",
                ],
              },
            ],
          })
          .then((ca) => {
            interaction
              .reply({ content: `**💾 - Criando Ticket...**`, ephemeral: true })
              .then(() => {
                setTimeout(() => {
                  let direciandoaocanal =
                    new Discord.ActionRowBuilder().addComponents(
                      new Discord.ButtonBuilder()
                        .setLabel(` - Ticket`)
                        .setEmoji(`🎫`)
                        .setStyle(5)
                        .setURL(
                          `https://discord.com/channels/${interaction.guild.id}/${ca.id}`
                        )
                    );
                  interaction.editReply({
                    content: `**💾 - Ticket criado na categoria!**`,
                    ephemeral: true,
                    components: [direciandoaocanal],
                  });
                }, 670);
              });

            let embedCanalTicket = new Discord.EmbedBuilder()
              .setColor("Random")
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL()}`,
              })
              .setThumbnail(`${interaction.guild.iconURL()}`)
              .setDescription(`*Fale, o que você precisa?*`)
              .addFields(
                {
                  name: "```Denúncias - Modelo:```",
                  value: `*Seu nome:*\n*Nome do Envolvido:*\n*ID do envolvido:*\n*Descrição do Ocorrido:*\n*Data e hora:*\n*Provas(testemunhas,prints,videos,etc):*\n`,
                  inline: false,
                },
                {
                  name: "```Suporte Geral - Modelo:```",
                  value: `*Seu nome:*\n*Motivo de abrir o Ticket:*\n*Descrição do Ocorrido:*\n*Data e hora:*\n`,
                  inline: false,
                }
              )
              .setTimestamp();

            let FecharTicket = new Discord.ActionRowBuilder().addComponents(
              new Discord.ButtonBuilder()
                .setLabel(` - Fechar & Salvar`)
                .setEmoji(`🔒`)
                .setCustomId("fechar")
                .setStyle(Discord.ButtonStyle.Primary),
              new Discord.ButtonBuilder()
                .setLabel(` - Lock`)
                .setEmoji(`🔐`)
                .setCustomId("lock")
                .setStyle(Discord.ButtonStyle.Danger),
              new Discord.ButtonBuilder()
                .setLabel(` - Unlock`)
                .setEmoji(`🔓`)
                .setCustomId("unlock")
                .setStyle(Discord.ButtonStyle.Success)
            );

            ca.send({ embeds: [embedCanalTicket], components: [FecharTicket] });
          });
      }
    }
  }
  if (interaction.isButton) {
    if (interaction.customId === "fechar") {
      const modalTicket = new Discord.ModalBuilder()
        .setCustomId("modal_ticket")
        .setTitle(`Fechar - Ticket`);
      const resposta1 = new Discord.TextInputBuilder()
        .setCustomId("resposta")
        .setLabel("Diga-nos a razão de fechar o ticket:")
        .setStyle(Discord.TextInputStyle.Paragraph);

      const firstActionRow = new Discord.ActionRowBuilder().addComponents(
        resposta1
      );
      modalTicket.addComponents(firstActionRow);
      await interaction.showModal(modalTicket);
    } else if (interaction.customId === "lock") {
      const cliente = interaction.guild.members.cache.get(
        interaction.channel.topic.slice(0, 18)
      );
      let cargoTicket2 = await db.get("cargoModerate.cargoM");
      if (
        !interaction.member.roles.cache.some(
          (role) => role.id == cargoTicket2.id
        )
      ) {
        interaction.reply({
          content: `**❌ - Apenas STAFF's podem selecionar esta opção!**`,
          ephemeral: true,
        });
      } else {
        interaction.channel.permissionOverwrites.edit(cliente.user, {
          ViewChannel: false,
        });
        interaction.reply(
          `**🔐 - Canal trancado, permissão de visualizar canal fechada para ${cliente.user}!**`
        );
      }
    } else if (interaction.customId === "unlock") {
      const cliente = interaction.guild.members.cache.get(
        interaction.channel.topic.slice(0, 18)
      );
      let cargoTicket2 = await db.get("cargoModerate.cargoM");
      if (
        !interaction.member.roles.cache.some(
          (role) => role.id == cargoTicket2.id
        )
      ) {
        interaction.reply({
          content: `**❌ - Apenas STAFF's podem selecionar esta opção!**`,
          ephemeral: true,
        });
      } else {
        interaction.channel.permissionOverwrites.edit(cliente.user, {
          ViewChannel: true,
        });
        interaction.reply(
          `**🔑 - 🔓 - Canal destrancado, permissão de visualizar canal concedida para ${cliente.user}!**`
        );
      }
    }
  }
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === "modal_ticket") {
    const respostaFinal = interaction.fields.getTextInputValue("resposta");

    interaction
      .reply({
        content: `**✅ - Resposta enviada, canal será deletado em 3s**`,
        ephemeral: true,
      })
      .then((aviso) => {
        setTimeout(() => {
          interaction
            .editReply(
              {
                content: `**✅ - Resposta enviada, canal será deletado em 2s**`,
                ephemeral: true,
              },
              1000
            )
            .then((aviso1) => {
              setTimeout(() => {
                interaction.editReply({
                  content: `**✅ - Resposta enviada, canal será deletado em 1s**`,
                  ephemeral: true,
                });
              }, 1000);
            })
            .then(() => {
              setTimeout(async () => {
                const cliente = interaction.guild.members.cache.get(
                  interaction.channel.topic.slice(0, 18)
                );

                let channel = interaction.channel;
                const attachment = await discordTranscripts.createTranscript(
                  channel,
                  {
                    fileName: `${channel.name}.html`,
                  }
                );

                interaction.channel.delete();
                const channelDeleted = interaction.channel.name;

                let embedLog = new Discord.EmbedBuilder()

                  .setAuthor({
                    name: `${cliente.user.username}`,
                    iconURL: `${cliente.user.displayAvatarURL()}`,
                  })
                  .setColor("Red")
                  .setTitle(`${channelDeleted}`)
                  .setDescription(
                    `*Ticket fechado, informações:* \n**(Transcripts Anexados)**\n`
                  )
                  .addFields(
                    {
                      name: `🆔 - ID de quem fechou:`,
                      value: `\`\`\`${interaction.user.id}\`\`\``,
                      inline: true,
                    },
                    {
                      name: `🆔 - ID de quem abriu:`,
                      value: `\`\`\`${cliente.id}\`\`\``,
                      inline: true,
                    },
                    {
                      name: `💬 - Quem fechou:`,
                      value: `${interaction.user}`,
                      inline: false,
                    },
                    {
                      name: `💬 - Quem abriu:`,
                      value: `${cliente.user}`,
                      inline: false,
                    },
                    {
                      name: `🎫 - Ticket:`,
                      value: `${channelDeleted}`,
                      inline: true,
                    },
                    {
                      name: "📕 - Motivo do Fechamento:",
                      value: `\`\`\`${respostaFinal}\`\`\``,
                      inline: false,
                    }
                  )
                  .setTimestamp()
                  .setFooter({
                    text: `Ticket fechado por: ${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL()}`,
                  })
                  .setThumbnail(`${cliente.user.displayAvatarURL()}`);

                let embedLogUser = new Discord.EmbedBuilder()

                  .setAuthor({
                    name: `${cliente.user.username}`,
                    iconURL: `${cliente.user.displayAvatarURL()}`,
                  })
                  .setColor("Green")
                  .setTitle(`Ticket Fechado!`)
                  .setDescription(`*Ticket fechado, informações:*`)
                  .addFields(
                    {
                      name: `💬 - Quem fechou:`,
                      value: `${interaction.user}`,
                      inline: false,
                    },
                    {
                      name: `💬 - Quem abriu:`,
                      value: `${cliente.user}`,
                      inline: false,
                    },
                    {
                      name: "📕 - Motivo do Fechamento:",
                      value: `\`\`\`${respostaFinal}\`\`\``,
                      inline: false,
                    }
                  )
                  .setTimestamp()
                  .setThumbnail(`${cliente.user.displayAvatarURL()}`)
                  .setFooter({
                    text: `Ticket fechado por: ${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL()}`,
                  });

                let canalLogsT = await db.get("channelLogTicket.channel");

                cliente.user.send({ embeds: [embedLogUser] });
                await interaction.guild.channels.cache
                  .get(`${canalLogsT.id}`)
                  .send({ embeds: [embedLog] });
              }, 1000);
            });
        });
      });
  }
});

// LOGS DE PING, ETC EM CALL

client.on("ready", () => {
  let canalPing = client.channels.cache.get("1066047778486239332");
  if (!canalPing) return console.log(`Canal de ping do bot não encontrado`);
  canalPing.setName(`📡 Ping: Calculando...`);
  setInterval(() => {
    canalPing.setName(`📡 Ping: ${client.ws.ping}ms`);
  }, 1000 * 60 * 4);
});

client.on("ready", () => {
  let users = client.guilds.cache
    .map((g) => g.memberCount)
    .reduce((a, b) => a + b);
  const compact = users.toLocaleString("pt-BR", { notation: "compact" });
  let membro = client.channels.cache.get("1066047818436988928");
  if (!membro) return console.log(`Canal de membros do bot não encontrado`);
  membro.setName(`📡 Membros: Calculando...`);
  setInterval(() => {
    membro.setName(`📡 Membros: ${compact}`);
  }, 1000 * 60 * 4);
});

client.on("ready", () => {
  let guilds = client.guilds.cache.size;
  let sv = client.channels.cache.get("1066047855288131654");
  if (!sv) return console.log(`Canal de servidores do bot não encontrado`);
  sv.setName(`📡 Servidores: Calculando...`);
  setInterval(() => {
    sv.setName(`📡 Servidores: ${guilds}`);
  }, 1000 * 60 * 4);
});

//COMADO PARA QUANDO DAR ERRO O BOT NÃO DESLIGAR

process.on("unhandRejection", (reason, promise) => {
  console.log(`🚨 | [Erro]\n\n` + reason, promise);
});
process.on("uncaughtException", (error, origin) => {
  console.log(`🚨 | [Erro]\n\n` + error, origin);
});
process.on("uncaughtExceptionMonitor", (error, origin) => {
  console.log(`🚨 | [Erro]\n\n` + error, origin);
});

// FORMULARIO STAFF

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "formulario") {
      if (
        !interaction.guild.channels.cache.get(
          await db.get(`canal_logs_${interaction.guild.id}`)
        )
      )
        return interaction.reply({
          content: `O sistema está desativado.`,
          ephemeral: true,
        });
      const modal = new Discord.ModalBuilder()
        .setCustomId("modal")
        .setTitle("Formulário");

      const pergunta1 = new Discord.TextInputBuilder()
        .setCustomId("pergunta1")
        .setLabel("Qual e seu nome/sobrenome?")
        .setMaxLength(20)
        .setPlaceholder("Nome/Sobrenome")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Short);

      const pergunta2 = new Discord.TextInputBuilder()
        .setCustomId("pergunta2")
        .setLabel("Qual e sua idade?")
        .setMaxLength(2)
        .setPlaceholder("Idade")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true);

      const pergunta3 = new Discord.TextInputBuilder()
        .setCustomId("pergunta3")
        .setLabel("Qual e seu horario disponivel?")
        .setPlaceholder("Manhã/Tarde/Noite/Madrugada")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true);

      const pergunta4 = new Discord.TextInputBuilder()
        .setCustomId("pergunta4")
        .setLabel("Porque devemos te aceitar na STAFF?")
        .setMaxLength(1000)
        .setPlaceholder("Motivo")
        .setStyle(Discord.TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new Discord.ActionRowBuilder().addComponents(pergunta1),
        new Discord.ActionRowBuilder().addComponents(pergunta2),
        new Discord.ActionRowBuilder().addComponents(pergunta3),
        new Discord.ActionRowBuilder().addComponents(pergunta4)
      );

      await interaction.showModal(modal);
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "modal") {
      let resposta1 = interaction.fields.getTextInputValue("pergunta1");
      let resposta2 = interaction.fields.getTextInputValue("pergunta2");
      let resposta3 = interaction.fields.getTextInputValue("pergunta3");
      let resposta4 = interaction.fields.getTextInputValue("pergunta4");

      if (!resposta1) resposta1 = "Não informado.";
      if (!resposta2) resposta2 = "Não informado.";
      if (!resposta3) resposta3 = "Não informado.";
      if (!resposta4) resposta4 = "Não informado.";

      let embed = new Discord.EmbedBuilder()
        .setColor("303136")
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `**Usuario:** ${interaction.user}\n**ID:** \`${interaction.user.id}\``
        )
        .addFields(
          {
            name: `Nome`,
            value: `\`\`\`${resposta1}\`\`\``,
            inline: true,
          },
          {
            name: `Idade`,
            value: `\`\`\`${resposta2}\`\`\``,
            inline: true,
          },
          {
            name: `Horarios`,
            value: `\`\`\`${resposta3}\`\`\``,
            inline: true,
          },
          {
            name: `Motivo`,
            value: `\`\`\`${resposta4}\`\`\``,
            inline: false,
          }
        );

      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription(
              `**${interaction.user},** Seu formulário foi enviado com sucesso. Aguarde a resposta no seu privado!`
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
      await interaction.guild.channels.cache
        .get(await db.get(`canal_logs_${interaction.guild.id}`))
        .send({ embeds: [embed] });
    }
  }
});

// AUTOROLE

client.on("guildMemberAdd", (member) => {
  if (db.get(`role.${member.guild.id}`)) {
    let role_id = db.get(`role.${member.guild.id}`);
    let role = member.guild.roles.cache.find((r) => r.id === role_id);
    try {
      member.roles.add(role);
    } catch (err) {
      console.log(`Autorole err: ${err.message}`);
    }
  }
});

// REGISTRO

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "homem") {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Verificando!")
            .setColor("Random")
            .setDescription(`Reconhecendo o cargo \`Homem\` para verificar...`)
            .setFooter({ text: `Recebendo informações...` })
            .setTimestamp(),
        ],
      });

      setTimeout(() => {
        interaction.editReply({
          ephemeral: true,
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Verificando!")
              .setColor("Random")
              .setDescription(
                `<a:carregando:1071496663702708406> | Procurando o cargo para adicionar...`
              )
              .setFooter({ text: `Carregando...` })
              .setTimestamp(),
          ],
        });
      }, 2000);
      setTimeout(() => {
        interaction.editReply({
          ephemeral: true,
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Sucesso!")
              .setColor("Random")
              .setDescription(
                `<:concluido:1050430939332874291> | Sucesso, cargo \`Homem\` reconhecido e adicionado!`
              )
              .setFooter({ text: `Carregamento concluido!` })
              .setTimestamp(),
          ],
        });
      }, 5000);

      let cargo_id1 = await db.get(`cargo1_${interaction.guild.id}`);
      let cargo1 = interaction.guild.roles.cache.get(cargo_id1);
      if (!cargo1) return;
      interaction.member.roles.add(cargo_id1);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "mulher") {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Verificando!")
            .setColor("Random")
            .setDescription(`Reconhecendo o cargo \`Mulher\` para verificar...`)
            .setFooter({ text: `Recebendo informações...` })
            .setTimestamp(),
        ],
      });
      setTimeout(() => {
        interaction.editReply({
          ephemeral: true,
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Verificando!")
              .setColor("Random")
              .setDescription(
                `<a:carregando:1071496663702708406> | Procurando o cargo para adicionar...`
              )
              .setFooter({ text: `Carregando...` })
              .setTimestamp(),
          ],
        });
      }, 2000);
      setTimeout(() => {
        interaction.editReply({
          ephemeral: true,
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Sucesso!")
              .setColor("Random")
              .setDescription(
                `<:concluido:1050430939332874291> | Sucesso, cargo \`Mulher\` reconhecido e adicionado!`
              )
              .setFooter({ text: `Carregamento concluido!` })
              .setTimestamp(),
          ],
        });
      }, 5000);

      let cargo_id2 = await db.get(`cargo2_${interaction.guild.id}`);
      let cargo2 = interaction.guild.roles.cache.get(cargo_id2);
      if (!cargo2) return;
      interaction.member.roles.add(cargo_id2);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "+18") {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Verificando!")
            .setColor("Random")
            .setDescription(`Reconhecendo o cargo \`+18\` para verificar...`)
            .setFooter({ text: `Recebendo informações...` })
            .setTimestamp(),
        ],
      });
      setTimeout(() => {
        interaction.editReply({
          ephemeral: true,
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Verificando!")
              .setColor("Random")
              .setDescription(
                `<a:carregando:1071496663702708406> | Procurando o cargo para adicionar...`
              )
              .setFooter({ text: `Carregando...` })
              .setTimestamp(),
          ],
        });
      }, 2000);
      setTimeout(() => {
        interaction.editReply({
          ephemeral: true,
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Sucesso!")
              .setColor("Random")
              .setDescription(
                `<:concluido:1050430939332874291> | Sucesso, cargo \`+18\` reconhecido e adicionado!`
              )
              .setFooter({ text: `Carregamento concluido!` })
              .setTimestamp(),
          ],
        });
      }, 5000);

      let cargo_id3 = await db.get(`cargo3_${interaction.guild.id}`);
      let cargo3 = interaction.guild.roles.cache.get(cargo_id3);
      if (!cargo3) return;
      interaction.member.roles.add(cargo_id3);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "-18") {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Verificando!")
            .setColor("Random")
            .setDescription(`Reconhecendo o cargo \`-18\` para verificar...`)
            .setFooter({ text: `Recebendo informações...` })
            .setTimestamp(),
        ],
      });
      setTimeout(() => {
        interaction.editReply({
          ephemeral: true,
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Verificando!")
              .setColor("Random")
              .setDescription(
                `<a:carregando:1071496663702708406> | Procurando o cargo para adicionar...`
              )
              .setFooter({ text: `Carregando...` })
              .setTimestamp(),
          ],
        });
      }, 2000);
      setTimeout(() => {
        interaction.editReply({
          ephemeral: true,
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Sucesso!")
              .setColor("Random")
              .setDescription(
                `<:concluido:1050430939332874291> | Sucesso, cargo \`-18\` reconhecido e adicionado!`
              )
              .setFooter({ text: `Carregamento concluido!` })
              .setTimestamp(),
          ],
        });
      }, 5000);

      let cargo_id4 = await db.get(`cargo4_${interaction.guild.id}`);
      let cargo4 = interaction.guild.roles.cache.get(cargo_id4);
      if (!cargo4) return;
      interaction.member.roles.add(cargo_id4);
    }
  }
});

// VERIFICAÇÃO

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "tickets_basico") {
      let nome_canal = `Verificação-${interaction.user.username}`;
      let canal = interaction.guild.channels.cache.find(c => c.name === nome_canal);

      if (canal) {
        interaction.reply({ content: `Olá **${interaction.user.username}**, você já possui um ticket de verificação aberto em ${canal}.`, ephemeral: true})
      } else {

        let categoria = interaction.channel.parent;
        if (!categoria) categoria = null;

        interaction.guild.channels.create({

          name: nome_canal,
          parent: categoria,
          type: Discord.ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [ Discord.PermissionFlagsBits.ViewChannel ]
            },
            {
              id: interaction.user.id,
              allow: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.AddReactions,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.AttachFiles,
                Discord.PermissionFlagsBits.EmbedLinks
              ]
            },
          ]

        }).then( (chat) => {

          interaction.reply({ content: `Olá **${interaction.user}**, sua verificação foi aberta em ${chat}.`, ephemeral: true })

          let embed = new Discord.EmbedBuilder()
          .setColor("Red")
          .setDescription(`Olá ${interaction.user}, você abriu a sua **Verificação**.\nPara se verificar é simples siga abaixo: \n\nAssim que um administrador ver o seu ticket ele ira te chamer em uma call, você tera que ligar a sua camera e mostrar seu rosto.\n\n**Depois disso você ira receber o cargo de <@&1071160448688345162>,**\n\nSimples não acha? Assim que tudo acabar o adm ira fechar seu ticket.`)

          let botao_close = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("close_ticket")
            .setEmoji("🔒")
            .setStyle(Discord.ButtonStyle.Danger)
          );

          chat.send({ embeds: [embed], components: [botao_close] }).then(m => {
            m.pin()
          })

        })
      }
    } else if (interaction.customId === "close_ticket") {
      interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos.`)
      try {
        setTimeout( () => {
          interaction.channel.delete().catch( e => { return; } )
        }, 5000)
      } catch (e) {
        return;
      }
      
    }
  }
})

//Id nas linhas 4,29
//--------------------------------------------------Mensagens editadas-----------------------------------------------
client.on("messageUpdate", (message, oldMessage, newMessage) => {
    const channel = client.channels.cache.get("1071160453524373507");
    const embed = new Discord.EmbedBuilder()
        .setTitle(`<<:pranchetared:1071547707384156170> ‣ LOG | Mensagem Editada.`)
        .setColor('Red')
        .setThumbnail(`${interaction.guild.iconURL()}`)
        .setFooter({ text:  `© ${client.user.username} 2023`})
        .setTimestamp(new Date())
        .setDescription(`**<:pessoared:1071547922640019527> ‣ Autor da mensagem** \n> **Usuário:** ${message.author} \n> **ID:** ${message.author.id} \n\n**<:7889discordchat:1046476120297582622> ‣ Canal:** \n> ${message.channel} \n\n**Mensagem antiga:** \n \`\`\`${message.content}\`\`\` \n**Mensagem nova:** \n \`\`\`${oldMessage.content}\`\`\``)

        let mensagem1 = new ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setLabel("Ir para mensagem")
                .setStyle(Discord.ButtonStyle.Link)
                .setURL(`${message.url}`)
                .setEmoji("📩")
        )

        channel.send({ embeds: [embed], components: [mensagem1] })
})
//--------------------------------------------------Mensagens editadas-----------------------------------------------



//--------------------------------------------------Mensagens Deletadas-----------------------------------------------
client.on("messageDelete", (message, oldMessage, newMessage) => {
    const channel = client.channels.cache.get("1071160453524373507");
    const embed = new Discord.EmbedBuilder()
        .setTitle(`<:pranchetared:1071547707384156170> ‣ LOG | Mensagem Deletada.`)
        .setColor('Red')
        .setFooter({ text:  `© ${client.user.username} 2023`})
        .setThumbnail(`${interaction.guild.iconURL()}`)
        .setTimestamp(new Date())
        .setDescription(`**<:pessoared:1071547922640019527> ‣ Autor da mensagem**  \n> **Usuário:** ${message.author} \n> **ID:** ${message.author.id} \n\n**<:7889discordchat:1046476120297582622> ‣ Canal:** \n> ${message.channel} \n\n**Mensagem deletada:** \n \`\`\`${message.content}\`\`\``)
        channel.send({ embeds: [embed] });
})
//--------------------------------------------------Mensagens Deletadas-----------------------------------------------
//   /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
