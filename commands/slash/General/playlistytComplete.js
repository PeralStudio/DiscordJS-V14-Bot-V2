const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const ytpl = require("ytpl");
const logger = require("../../../utils/logger");

module.exports = {
    name: "playlistytComplete",
    description: "Playlist Youtube",
    type: 1,
    options: [
        {
            type: 3,
            name: "url",
            description: "URL o ID de la Playlist YT.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const idChannel = interaction.options.get("url").value;
        let playlistTemp;

        function extractPlaylistId(url) {
            const parsedUrl = new URL(url);
            const playlistId = parsedUrl.searchParams.get("list");
            return playlistId;
        }

        if (
            idChannel.includes("https") ||
            idChannel.includes("http") ||
            idChannel.includes("www.youtube.com/playlist") ||
            idChannel.includes("youtube.com/playlist")
        ) {
            playlistTemp = extractPlaylistId(idChannel);
        } else {
            playlistTemp = idChannel;
        }

        logger.info(playlistTemp);

        try {
            // Obtener la información de la playlist usando ytpl
            const playlist = await ytpl(playlistTemp); // Obtener la playlist completa

            if (playlist.items.length > 0) {
                // Recorrer cada video de la playlist y crear un embed
                for (const item of playlist.items) {
                    // Crear un embed por cada video
                    const embed = new EmbedBuilder()
                        .setTitle(item.title) // Título del video
                        .setURL(item.shortUrl) // URL del video
                        .setDescription(`Duración: ${item.duration}`) // Duración del video
                        .setThumbnail(item.bestThumbnail.url) // Miniatura del video
                        .addFields(
                            { name: "Canal", value: item.author.name, inline: true }, // Nombre del canal
                            { name: "ID del Video", value: item.id, inline: true }, // ID del video
                            { name: "En vivo", value: item.isLive ? "Sí" : "No", inline: true } // Si el video está en vivo o no
                        )
                        .setColor("#FF0000") // Color del embed (rojo, estilo YouTube)
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        });

                    // Enviar el embed
                    await interaction.channel.send({ embeds: [embed] });
                }

                // Responder al usuario que los videos han sido enviados
                await interaction.reply(
                    `Se enviaron los videos de la playlist **${playlist.title}**.`
                );
            } else {
                await interaction.reply("No se encontraron videos en la playlist.");
            }
        } catch (error) {
            console.error(error);
            await interaction.reply("Hubo un error al recuperar la playlist.");
        }
    }
};
