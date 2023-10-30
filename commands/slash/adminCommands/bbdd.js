const { EmbedBuilder } = require("discord.js");
const { connection } = require("mongoose");
require("dotenv").config();

module.exports = {
    name: "bbdd",
    description: `Ver todas las colecciones de la BBDD`,
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para usar este comando.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        const collections = await connection.collections;
        const collectionsArray = [];

        for (const collection in collections) {
            const collectionsLength = await collections[collection].countDocuments();
            collectionsArray.push(`**${collection}**: \`${collectionsLength} Documentos\``);
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Colecciones de la BBDD")
                    .setDescription(collectionsArray.join("\n\n"))
                    .setColor("#0099ff")
                    .setThumbnail(
                        "https://i.blogs.es/577c8b/650_1000_mongo_bumper.sh-600x600/1366_2000.png"
                    )
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    })
            ],
            ephemeral: true
        });
    }
};
