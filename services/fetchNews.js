const { EmbedBuilder, WebhookClient } = require("discord.js");
const deleteOldMsg = require("./deleteOldMsg");
const axios = require("axios");
const cron = require("node-cron");
const superDjs = require("super-djs");
const dotenv = require("dotenv");
dotenv.config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

const fetchNews = async (client, user) => {
    const { NEWSCATCHERAPI_KEY, NOTICIAS_CHANNEL_ID } = process.env;
    const news = [];

    cron.schedule(
        "0 9 * * *",
        async () => {
            //Delete old messages
            deleteOldMsg(client, NOTICIAS_CHANNEL_ID);

            var options = {
                method: "GET",
                url: "https://api.newscatcherapi.com/v2/search",
                params: {
                    q: "actualidad",
                    lang: "es",
                    sort_by: "date",
                    page: "1",
                    countries: "ES",
                    page_size: "10",
                    sources: "lasexta.com,elmundo.es,20minutos.es,eldiario.es,"
                },
                headers: {
                    "x-api-key": NEWSCATCHERAPI_KEY
                }
            };

            await axios
                .request(options)
                .then(function (response) {
                    news.push(response.data.articles);
                })
                .catch(function (error) {
                    const embed = new EmbedBuilder()
                        .setTitle("Error en la API de NewsCatcher")
                        .setThumbnail(client.user.displayAvatarURL())
                        .addFields(
                            {
                                name: "Status",
                                value: `${error.response.data.status}`,
                                inline: false
                            },
                            {
                                name: "Error Code",
                                value: `${error.response.data.error_code}`,
                                inline: false
                            },
                            {
                                name: "Message",
                                value: `${error.response.data.message}`,
                                inline: false
                            }
                        )
                        .setTimestamp()
                        .setColor("#ff0000")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        });

                    return webhook.send({
                        embeds: [embed]
                    });
                });

            news[0].forEach(async (element) => {
                if (news[0].length < 0) {
                    console.log("news[0].length < 0 --no hay datos");
                    return;
                }
                const noImage = "https://i.ytimg.com/vi/QCDkwhQXI4Y/maxresdefault.jpg";

                const embed = new EmbedBuilder()
                    .setTitle(`${element.title ? element.title : " "}`)
                    .setDescription(`${element.summary ? element.summary.normalize() : " "}`)
                    .setThumbnail(
                        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrlxr-a5Ix7nMoEFFR3m-oso2Kq6ldtncuqTxyv-Ey-czcfqU-_nhbXqlND1OVSi6rDnw&usqp=CAU`
                    )
                    .setURL(`${element.link ? element.link : null}`)
                    .setImage(element.media ? element.media : noImage)
                    .setTimestamp()
                    .setFooter({
                        text: `Fuente: ${element.rights} Autor: ${element.author}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setColor("#FF0000");

                await client.channels.cache.get(NOTICIAS_CHANNEL_ID).send({ embeds: [embed] });

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
            });
        },
        {
            timezone: "Europe/Madrid"
        }
    );
};

module.exports = fetchNews;
