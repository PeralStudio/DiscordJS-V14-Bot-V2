const { EmbedBuilder } = require("discord.js");
const backup = require("discord-backup");
const path = require("path");
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

        // todo --> Create bacups only locally
        const createBackup = async () => {
            let embed;

            backup.setStorageFolder(path.join(__dirname, "../../../backups"));
            await backup
                .create(interaction.member.guild, {
                    jsonBeautify: true,
                })
                .then(async (backupData) => {
                    embed = new EmbedBuilder()
                        .setTitle(
                            "✅ㅤ¡La copia de seguridad ha sido creada! Para cargarla, escriba este comando en el servidor de su elección: `" +
                                process.env.PREFIX +
                                "load-backup " +
                                backupData.id +
                                "`!"
                        )
                        .setDescription(`Backup creado por <@${interaction.user.id}>`)
                        .setColor("#1cc91c")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setTimestamp();
                })
                .catch(async (e) => {
                    embed = new EmbedBuilder()
                        .setDescription(`❌ㅤError: ${e}`)
                        .setColor("#db1e1e")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setTimestamp();
                });

            return embed;
        };

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });
        const result = await createBackup();
        await interaction.editReply({ embeds: [result], ephemeral: true });
    },
};
