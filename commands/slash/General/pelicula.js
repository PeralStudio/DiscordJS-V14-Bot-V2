const fetch = require("node-fetch");
const { EmbedBuilder, WebhookClient } = require("discord.js");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "pelicula",
    description: "Busca información sobre una película.",
    type: 1,
    options: [
        {
            type: 3,
            name: "titulo",
            description: "El título de la película que deseas buscar.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction) => {
        const { TMDB_KEY } = process.env;
        const titulo = interaction.options.getString("titulo");

        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            titulo
        )}&include_adult=false&language=es-ES&page=1`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_KEY}`
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const peliculas = data.results;

            if (peliculas.length === 0) {
                return interaction.reply(`No encontré resultados para "${titulo}".`);
            }

            const pelicula = peliculas[0];
            const posterUrl = `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`;

            const [año, mes, dia] = pelicula.release_date.split("-");
            const fechaFormateada = `${dia}-${mes}-${año}`;

            const embed = new EmbedBuilder()
                .setTitle(pelicula.title)
                .setDescription(pelicula.overview || "No hay sinopsis disponible.")
                .addFields(
                    {
                        name: "Fecha de estreno",
                        value: fechaFormateada || "Desconocida",
                        inline: true
                    },
                    {
                        name: "Calificación",
                        value: pelicula.vote_average.toFixed(1).toString() || "N/A",
                        inline: true
                    }
                )
                .setImage(posterUrl)
                .setColor("#00FF00")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(`Error al buscar la película "${titulo}": ${error}`);
            webhook.send(`Error al buscar la película "${titulo}": ${error}`);
            await interaction.reply(
                "Hubo un error al buscar la película. Intenta nuevamente más tarde."
            );
        }
    }
};
