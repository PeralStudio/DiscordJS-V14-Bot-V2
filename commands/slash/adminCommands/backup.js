const { EmbedBuilder } = require("discord.js");
const backup = require("discord-backup");
require("dotenv").config();

module.exports = {
    name: "crear-backup",
    description: "Crear backup servidor.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder().setDescription("⛔ No tienes permisos.").setColor("#EA3939"),
                ],
            });
            return;
        }

        const createBackup = async () => {
            let embed;

            await backup
                .create(interaction.member.guild, {
                    jsonBeautify: true,
                })
                .then(async (backupData) => {
                    // And send informations to the backup owner

                    embed = new EmbedBuilder()
                        .setTitle(
                            "¡La copia de seguridad ha sido creada! Para cargarla, escriba este comando en el servidor de su elección: `" +
                                process.env.PREFIX +
                                "load-backup " +
                                backupData.id +
                                "`!"
                        )
                        .setDescription(`Backup creado por <@${interaction.user.id}>`)
                        .setColor("BLUE")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setTimestamp();

                    // interaction.reply({ embeds: [embed], ephemeral: true });
                })
                .catch(async (e) => {
                    console.log(e);
                    embed = new EmbedBuilder()
                        .setDescription(`Error: ${e}`)
                        .setColor("BLUE")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setTimestamp();

                    // await interaction.reply({ embeds: [embed], ephemeral: true });
                });

            return embed;
        };

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });
        const result = await createBackup();
        await interaction.editReply({ embeds: [result], ephemeral: true });
    },
};
