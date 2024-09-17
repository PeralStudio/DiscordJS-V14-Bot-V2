const { EmbedBuilder } = require("discord.js");
const backup = require("discord-backup");
const path = require("path");
const logger = require("../../../utils/logger");
require("dotenv").config();

module.exports = {
    name: "delete-backup",
    description: "Borrar un backup del servidor",
    type: 1,
    options: [
        {
            type: 3,
            name: "id-backup",
            description: "Id del backup.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder().setDescription("⛔ No tienes permisos.").setColor("#EA3939")
                ]
            });
            return;
        }

        const idBackup = interaction.options.get("id-backup").value;

        const deleteBackup = async () => {
            let embed;

            // todo --> Delete backups only locally
            backup.setStorageFolder(path.join(__dirname, "../../../backups"));
            await backup
                .remove(idBackup, {
                    jsonBeautify: true
                })
                .then(async () => {
                    embed = new EmbedBuilder()
                        .setTitle(
                            `✅ ¡La copia de seguridad {${idBackup}} ha sido borrada con éxito!`
                        )
                        .setDescription(`Backup borrado por <@${interaction.user.id}>`)
                        .setColor("#1cc91c")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTimestamp();
                })
                .catch(async (e) => {
                    logger.error(e);
                    embed = new EmbedBuilder()
                        .setDescription(`❌ Error: ${e}`)
                        .setColor("#db1e1e")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTimestamp();
                });

            return embed;
        };

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });
        const result = await deleteBackup();
        await interaction.editReply({ embeds: [result], ephemeral: true });
    }
};
