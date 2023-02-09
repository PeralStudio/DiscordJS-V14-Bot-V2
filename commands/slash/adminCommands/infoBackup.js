const { EmbedBuilder } = require("discord.js");
const backup = require("discord-backup");
const moment = require("moment");
require("dotenv").config();

module.exports = {
    name: "info-backup",
    description: "Crear backup servidor.",
    type: 1,
    options: [
        {
            type: 3,
            name: "id-backup",
            description: "Id del backup.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const idBackup = interaction.options.get("id-backup").value;

        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder().setDescription("⛔ No tienes permisos.").setColor("#EA3939"),
                ],
            });
            return;
        }

        const getBackup = async () => {
            let embed;
            await backup
                .fetch(idBackup)
                .then((backupInfos) => {
                    const date = new Date(backupInfos.data.createdTimestamp);
                    embed = new EmbedBuilder()
                        .setTitle("🔎 Información del backup")
                        .addFields(
                            {
                                name: "Backup ID",
                                value: backupInfos.id,
                                inline: false,
                            },
                            {
                                name: "Servidor ID",
                                value: backupInfos.data.guildID,
                                inline: false,
                            },
                            {
                                name: "Tamaño",
                                value: `${backupInfos.size} kb`,
                                inline: false,
                            },
                            {
                                name: "Creado",
                                value: `${moment(date)
                                    .locale("es")
                                    .format("DD/MM/YYYY (HH:mm:ss)")}`,
                                inline: false,
                            }
                        )
                        .setColor("#FF0000")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        });
                })
                .catch((err) => {
                    embed = new EmbedBuilder()
                        .setTitle("⛔ No existe un backup con ese ID.\n")
                        .addFields({
                            name: "Backup ID",
                            value: idBackup,
                            inline: false,
                        })
                        .setColor("#FF0000")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        });
                });

            return embed;
        };

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });
        const result = await getBackup();
        await interaction.editReply({ embeds: [result], ephemeral: true });
    },
};
