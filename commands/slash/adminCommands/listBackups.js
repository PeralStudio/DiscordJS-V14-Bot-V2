const { EmbedBuilder } = require("discord.js");
const backup = require("discord-backup");
const path = require("path");
require("dotenv").config();

module.exports = {
    name: "list-backup",
    description: "Lista de backups",
    type: 1,
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

        let backupsArray;

        backup.setStorageFolder(path.join(__dirname, "../../../backups"));
        await backup.list().then((backups) => {
            backupsArray = backups;
        });

        const bakcupsList = backupsArray
            .map((backup) => ":open_file_folder: `" + backup + "`")
            .join("\n\n");

        if (backupsArray.length > 0) {
            const embed = new EmbedBuilder()
                .setTitle(`Backups disponibles`)
                .setDescription(`${bakcupsList}`)
                .setColor("#D4B053")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`⛔ No hay backups disponibles`)
                .setColor("#db1e1e")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
