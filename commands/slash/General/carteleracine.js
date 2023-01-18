const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
require("dotenv").config();

module.exports = {
    name: "carteleracine",
    description: "Ver la cartelera de cine de hoy.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const author = interaction.user.id;

        await fetch(
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_KEY}&language=es-ES&page=1`
        )
            .then((res) => res.json())
            .then(async (data) => {
                data.results.length = data.results.length - 10;

                const embed1 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[0].title)
                    .setDescription(
                        `${
                            data.results[0].overview.length > 1000
                                ? data.results[0].overview.substring(0, 1000) + "..."
                                : data.results[0].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[0].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[1].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[0].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed2 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[1].title)
                    .setDescription(
                        `${
                            data.results[1].overview.length > 1000
                                ? data.results[1].overview.substring(0, 1000) + "..."
                                : data.results[1].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[1].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[1].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[1].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed3 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[2].title)
                    .setDescription(
                        `${
                            data.results[2].overview.length > 1000
                                ? data.results[2].overview.substring(0, 1000) + "..."
                                : data.results[2].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[2].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[2].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[2].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed4 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[3].title)
                    .setDescription(
                        `${
                            data.results[3].overview.length > 1000
                                ? data.results[3].overview.substring(0, 1000) + "..."
                                : data.results[3].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[3].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[3].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[3].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed5 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[4].title)
                    .setDescription(
                        `${
                            data.results[4].overview.length > 1000
                                ? data.results[4].overview.substring(0, 1000) + "..."
                                : data.results[4].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[4].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[4].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[4].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed6 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[5].title)
                    .setDescription(
                        `${
                            data.results[5].overview.length > 1000
                                ? data.results[5].overview.substring(0, 1000) + "..."
                                : data.results[5].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[5].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[5].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[5].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed7 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[6].title)
                    .setDescription(
                        `${
                            data.results[6].overview.length > 1000
                                ? data.results[6].overview.substring(0, 1000) + "..."
                                : data.results[6].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[6].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[6].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[6].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed8 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[7].title)
                    .setDescription(
                        `${
                            data.results[7].overview.length > 1000
                                ? data.results[7].overview.substring(0, 1000) + "..."
                                : data.results[7].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[7].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[7].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[7].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed9 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[8].title)
                    .setDescription(
                        `${
                            data.results[8].overview.length > 1000
                                ? data.results[8].overview.substring(0, 1000) + "..."
                                : data.results[8].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[8].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[8].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[8].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                const embed10 = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle(data.results[9].title)
                    .setDescription(
                        `${
                            data.results[9].overview.length > 1000
                                ? data.results[9].overview.substring(0, 1000) + "..."
                                : data.results[9].overview
                        }`
                    )
                    .addFields(
                        {
                            name: "Fecha Estreno",
                            value: moment(data.results[9].release_date).format("DD-MM-YYYY"),
                            inline: true,
                        },
                        {
                            name: "Puntuación",
                            value: `⠀⠀${data.results[9].vote_average.toString()}`,
                            inline: true,
                        }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/w500/${data.results[9].poster_path}`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                await client.users.fetch(author).then((user) => {
                    user.send({
                        embeds: [
                            embed1,
                            embed2,
                            embed3,
                            embed4,
                            embed5,
                            embed6,
                            embed7,
                            embed8,
                            embed9,
                            embed10,
                        ],
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                interaction.reply({
                    content: ":white_check_mark: ¡ Se ha enviado la cartelera a tu DM !",
                    ephemeral: true,
                });
            });
    },
};
