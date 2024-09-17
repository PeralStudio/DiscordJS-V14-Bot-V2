const { EmbedBuilder, WebhookClient } = require("discord.js");
const deleteOldMsg = require("./deleteOldMsg");
const cron = require("node-cron");
const fetch = require("node-fetch");
const logger = require("../utils/logger");
require("dotenv").config();

const webhookNews = new WebhookClient({
    url: process.env.WEBHOOK_NOTICIAS_CHANNEL
});

const fetchNews = async (client, user) => {
    const { GNEWS_KEY, NOTICIAS_CHANNEL_ID } = process.env;
    const url = `https://gnews.io/api/v4/search?q=general&lang=es&country=es&max=10&apikey=${GNEWS_KEY}`;

    cron.schedule(
        "0 9 * * *",
        async () => {
            // Eliminar mensajes antiguos
            await deleteOldMsg(client, NOTICIAS_CHANNEL_ID);

            try {
                // Fetch de noticias
                const response = await fetch(url);

                // Verificar si la respuesta es correcta
                if (!response.ok) {
                    throw new Error(`Error al obtener las noticias: ${response.statusText}`);
                }

                const articles = await response.json();

                // Enviar noticias al canal
                for (const article of articles.articles) {
                    const embed = new EmbedBuilder()
                        .setTitle(article?.title || "Sin título")
                        .setDescription(article?.description || "Sin descripción")
                        .setURL(article?.url)
                        .setImage(article?.image)
                        .setFooter({
                            text: article?.source?.name || "Fuente desconocida"
                        });

                    await webhookNews.send({
                        embeds: [embed]
                    });

                    // Imprimir logs en la consola
                    logger.info(
                        `¡Nuevas noticias publicadas en: 📰-noticias ${new Date().toLocaleTimeString(
                            "es-ES",
                            {
                                timeZone: "Europe/Madrid"
                            }
                        )}`
                    );
                }
            } catch (error) {
                logger.error(`Error al obtener o enviar las noticias: ${error.message}`);
            }
        },
        {
            timezone: "Europe/Madrid"
        }
    );
};

module.exports = fetchNews;
