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
        await interaction.deferReply({ ephemeral: true });

        const collectionName = interaction.options.getString("collenctionname");

        if (collectionName) {
            const collectionsLength = await connection.collections[collectionName].countDocuments();
            const collectionItems = await connection.collections[collectionName].find({});
            const collectionItemsData = await collectionItems.toArray();

            const baseEmbed = new EmbedBuilder()
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

            // Dividir los documentos en lotes de 24
            for (let i = 0; i < collectionItemsData.length; i += 24) {
                const chunk = collectionItemsData.slice(i, i + 24);
                const embedCollections = new EmbedBuilder(baseEmbed);

                chunk.forEach((item, index) => {
                    embedCollections.addFields({
                        name: `Documento ${i + index + 1}`,
                        value: `\`\`\`${JSON.stringify(item, null, 2)}\`\`\``
                    });
                });

                if (i === 0) {
                    await interaction.editReply({ embeds: [embedCollections], ephemeral: true });
                } else {
                    await interaction.followUp({ embeds: [embedCollections], ephemeral: true });
                }
            }

            return;
        }

        const collections = await connection.db.listCollections().toArray();
        const collectionsArray = [];

        for (const collection of collections) {
            const collectionsLength = await connection.db
                .collection(collection.name)
                .countDocuments();
            collectionsArray.push(`**${collection.name}**: \`${collectionsLength} Documentos\``);
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
