const { EmbedBuilder } = require("discord.js");
const { connection } = require("mongoose");
require("dotenv").config();

module.exports = {
    name: "bbdd",
    description: `Ver todas las colecciones de la BBDD`,
    type: 1,
    options: [
        {
            type: 3,
            name: "collenctionname",
            description: "Nombre de la colección."
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para usar este comando.")
                        .setColor("#EA3939")
                ],
                ephemeral: true
            });
            return;
        }

        const collectionName = interaction.options.getString("collenctionname");

        if (collectionName) {
            const collectionsLength = await connection.collections[collectionName].countDocuments();
            const collectionItems = await connection.collections[collectionName].find({});
            const collectionItemsData = await collectionItems.toArray();

            const embedCollections = new EmbedBuilder()
                .setTitle(`Colección **${collectionName}**`)
                .setDescription(`\`${collectionsLength} Documentos\``)
                .setColor("#0099ff")
                .setThumbnail(
                    "https://i.blogs.es/577c8b/650_1000_mongo_bumper.sh-600x600/1366_2000.png"
                )
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            for (const item of collectionItemsData) {
                embedCollections.addFields({
                    name: "Documento",
                    value: `\`\`\`${JSON.stringify(item, null, 2)}\`\`\``
                });
            }
            interaction.reply({
                embeds: [embedCollections],
                ephemeral: true
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
