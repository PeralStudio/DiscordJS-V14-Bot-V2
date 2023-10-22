const { EmbedBuilder, WebhookClient } = require("discord.js");
const deleteOldMsg = require("./deleteOldMsg");
const cron = require("node-cron");
const superDjs = require("super-djs");
require("dotenv").config();

const webhookNews = new WebhookClient({
    url: process.env.WEBHOOK_NOTICIAS_CHANNEL
});

const fetchNews = async (client, user) => {
    const { GNEWS_KEY, NOTICIAS_CHANNEL_ID } = process.env;
    const apiKey = GNEWS_KEY;
    const url = `https://gnews.io/api/v4/search?q=general&lang=es&country=es&max=10&apikey=${apiKey}`;

    cron.schedule(
        "0 9 * * *",
        async () => {
            // Delete old messages
            deleteOldMsg(client, NOTICIAS_CHANNEL_ID);

            // Fetch news
            const response = await fetch(url);
            const articles = await response.json();

            // Send news to channel
            for (const article of articles.articles) {
                const embed = new EmbedBuilder()
                    .setTitle(article?.title)
                    .setDescription(article?.description)
                    .setURL(article?.url)
                    .setImage(article?.image)
                    .setFooter({
                        text: article?.source?.name
                    });

                await webhookNews.send({
                    embeds: [embed]
                });

                // Print console logs
                console.log(
                    superDjs.colourText(
                        `¡Nuevas noticias publicadas en: 📰-noticias ${new Date().toLocaleTimeString(
                            "es-ES",
                            {
                                timeZone: "Europe/Madrid"
                            }
                        )}`,
                        "green"
                    )
                );
            }
        },
        {
            timezone: "Europe/Madrid"
        }
    );
};

module.exports = fetchNews;
