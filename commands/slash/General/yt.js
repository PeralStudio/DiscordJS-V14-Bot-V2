const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const logger = require("../../../utils/logger");
require("dotenv").config();

module.exports = {
    name: "yt",
    description: "Buscar un video en YouTube.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a buscar en YouTube.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const { YOUTUBE_KEY } = process.env;
        const query = interaction.options.get("texto").value;

        try {
            const response = await axios.request({
                method: "GET",
                url: "https://www.googleapis.com/youtube/v3/search",
                params: {
                    part: "snippet",
                    q: query,
                    key: YOUTUBE_KEY,
                    maxResults: 2,
                    type: "video"
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const videos = response.data.items;
            if (videos.length === 0) {
                return interaction.reply(`No se encontraron videos para: \`${query}\``);
            }

            const video1 = videos[0];
            const video2 = videos[1];

            // Enviar un mensaje con los enlaces a los videos
            const mensaje =
                "Aquí están los resultados para " +
                "**`" +
                query +
                "`**:\n\n" +
                `1- https://www.youtube.com/watch?v=${video1.id.videoId}\n` +
                `2- https://www.youtube.com/watch?v=${video2.id.videoId}`;

            await interaction.reply(mensaje);
        } catch (e) {
            logger.error(`Error: ${e}`);
            await interaction.reply(`Hubo un error al realizar la búsqueda: ${e}`);
        }
    }
};
