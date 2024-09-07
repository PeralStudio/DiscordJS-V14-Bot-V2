const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
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

            const embed1 = new EmbedBuilder()
                .setTitle(video1.snippet.title)
                .setURL(`https://www.youtube.com/watch?v=${video1.id.videoId}`)
                .setImage(video1.snippet.thumbnails.high.url) // Portada del video
                .setDescription(`Descripción:\n\n${video1.snippet.description}`)
                .setColor("#FF0000")
                .setTimestamp();

            const embed2 = new EmbedBuilder()
                .setTitle(video2.snippet.title)
                .setURL(`https://www.youtube.com/watch?v=${video2.id.videoId}`)
                .setImage(video2.snippet.thumbnails.high.url) // Portada del video
                .setDescription(`Descripción:\n\n${video2.snippet.description}`)
                .setColor("#FF0000")
                .setTimestamp();

            await interaction.reply({ embeds: [embed1, embed2] });
        } catch (error) {
            console.error(error);
            await interaction.reply(`Hubo un error al realizar la búsqueda: ${error}`);
        }
    }
};
