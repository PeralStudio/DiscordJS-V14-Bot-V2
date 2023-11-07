const { EmbedBuilder } = require("discord.js");
const { connection } = require("mongoose");
require("dotenv").config();

module.exports = {
    name: "bbdd-borrar",
    description: "Borrar colección bbdd",
    type: 1,
    options: [
        {
            type: 3,
            name: "collectionname",
            description: "Nombre de la colección a borrar.",
            required: true
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

        const collectionName = interaction.options.getString("collectionname");
        const collectionNames = await connection.db.listCollections().toArray();

        const collections = await connection.db.listCollections().toArray();
        const collectionsArray = [];

        for (const collection of collections) {
            const collectionsLength = await connection.db
                .collection(collection.name)
                .countDocuments();
            collectionsArray.push(`**${collection.name}**: \`${collectionsLength} Documentos\``);
        }

        if (collectionNames.some((col) => col.name === collectionName)) {
            await connection.db.dropCollection(collectionName);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`✅ Colección **${collectionName}** borrada correctamente.`)
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
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            `❌ La colección **${collectionName}** no existe.\nEstas son las colecciones existentes:`
                        )
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
    }
};
