const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

module.exports = {
    name: "lol",
    description: "Mostrar información de un Invocador.",
    type: 1,
    options: [
        {
            type: 3,
            name: "invocador",
            description: "Invocador a mostrar la información.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        let embed1;
        let embed2;

        await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
            .then((res) => res.json())
            .then((version) => {
                currentVersion = version[0];
            })
            .catch((err) => {
                console.log(err);
            });

        fetch(
            `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${
                interaction.options.get("invocador").value
            }?api_key=${process.env.LOL_KEY}`
        )
            .then((res) => res.json())
            .then((datasumm) => {
                if (datasumm?.status?.status_code === 404) {
                    interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `⚠️ No se ha encontrado a **${
                                        interaction.options.get("invocador").value
                                    }** , comprueba que has escrito correctamente el nombre.`
                                )
                                .setColor("#EA3939")
                        ]
                    });
                    return;
                }
                fetch(
                    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${datasumm.id}?api_key=${process.env.LOL_KEY}`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.length === 0) {
                            interaction.reply({
                                ephemeral: true,
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription(
                                            `ℹ️  El invocador **${
                                                interaction.options.get("invocador").value
                                            }** es UNRANKED, no hay datos.`
                                        )
                                        .setColor("#EA3939")
                                ]
                            });
                            return;
                        }
                        if (data.length > 0 && data.length < 2) {
                            const {
                                queueType,
                                tier,
                                rank,
                                summonerName,
                                leaguePoints,
                                wins,
                                losses
                            } = data[0];

                            embed1 = new EmbedBuilder()
                                .setAuthor({
                                    name: `${summonerName}`,
                                    iconURL: `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/${datasumm.profileIconId}.png`
                                })
                                .addFields(
                                    // { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "Tipo de cola",
                                        value: queueType
                                    },
                                    { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "📈 División:",
                                        value: `⠀⠀⠀${tier}`,
                                        inline: true
                                    },
                                    {
                                        name: "🏅 Rango:",
                                        value: `⠀⠀⠀${rank}`,
                                        inline: true
                                    },
                                    {
                                        name: "💯 League Points:",
                                        value: `⠀⠀⠀${leaguePoints} LP`,
                                        inline: true
                                    },
                                    { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "✅ Victorias:",
                                        value: `⠀⠀⠀${wins}`,
                                        inline: true
                                    },
                                    {
                                        name: "❌ Derrotas:",
                                        value: `⠀⠀⠀${losses}`,
                                        inline: true
                                    },
                                    {
                                        name: "🏆 Winrate:",
                                        value:
                                            `⠀⠀⠀` +
                                            ((wins / (wins + losses)) * 100).toFixed(0) +
                                            "%",
                                        inline: true
                                    },
                                    { name: "\u200B", value: "\u200B" }
                                )
                                .setThumbnail(
                                    `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/${datasumm.profileIconId}.png`
                                )
                                .setTimestamp()
                                .setColor("#0099ff")
                                .setFooter({
                                    text: process.env.NAME_BOT,
                                    iconURL: client.user.displayAvatarURL()
                                });

                            return interaction.reply({ embeds: [embed1] });
                        }

                        if (data.length > 1) {
                            embed1 = new EmbedBuilder()

                                .setAuthor({
                                    name: `${data[0].summonerName}`,
                                    iconURL: `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/${datasumm.profileIconId}.png`
                                })
                                .addFields(
                                    // { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "Tipo de cola",
                                        value: data[0].queueType
                                    },
                                    { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "📈 División:",
                                        value: `⠀⠀⠀${data[0].tier}`,
                                        inline: true
                                    },
                                    {
                                        name: "🏅 Rango:",
                                        value: `⠀⠀⠀${data[0].rank}`,
                                        inline: true
                                    },
                                    {
                                        name: "💯 League Points:",
                                        value: `⠀⠀⠀${data[0].leaguePoints} LP`,
                                        inline: true
                                    },
                                    { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "✅ Victorias:",
                                        value: `⠀⠀⠀${data[0].wins}`,
                                        inline: true
                                    },
                                    {
                                        name: "❌ Derrotas:",
                                        value: `⠀⠀⠀${data[0].losses}`,
                                        inline: true
                                    },
                                    {
                                        name: "🏆 Winrate:",
                                        value:
                                            `⠀⠀⠀` +
                                            (
                                                (data[0].wins / (data[0].wins + data[0].losses)) *
                                                100
                                            ).toFixed(0) +
                                            "%",
                                        inline: true
                                    },
                                    { name: "\u200B", value: "\u200B" }
                                )
                                .setThumbnail(
                                    `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/${datasumm.profileIconId}.png`
                                )
                                .setTimestamp()
                                .setColor("#0099ff")
                                .setFooter({
                                    text: process.env.NAME_BOT,
                                    iconURL: client.user.displayAvatarURL()
                                });

                            embed2 = new EmbedBuilder()
                                .setAuthor({
                                    name: `${data[1].summonerName}`,
                                    iconURL: `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/${datasumm.profileIconId}.png`
                                })
                                .addFields(
                                    // { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "Tipo de cola",
                                        value: data[1].queueType
                                    },
                                    { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "📈 División:",
                                        value: `⠀⠀⠀${data[1].tier}`,
                                        inline: true
                                    },
                                    {
                                        name: "🏅 Rango:",

                                        value: `⠀⠀⠀${data[1].rank}`,
                                        inline: true
                                    },
                                    {
                                        name: "💯 League Points:",
                                        value: `⠀⠀⠀${data[1].leaguePoints} LP`,
                                        inline: true
                                    },
                                    { name: "\u200B", value: "\u200B" },
                                    {
                                        name: "✅ Victorias:",
                                        value: `⠀⠀⠀${data[1].wins}`,
                                        inline: true
                                    },
                                    {
                                        name: "❌ Derrotas:",

                                        value: `⠀⠀⠀${data[1].losses}`,
                                        inline: true
                                    },
                                    {
                                        name: "🏆 Winrate:",

                                        value:
                                            `⠀⠀⠀` +
                                            (
                                                (data[1].wins / (data[1].wins + data[1].losses)) *
                                                100
                                            ).toFixed(0) +
                                            "%",
                                        inline: true
                                    },
                                    { name: "\u200B", value: "\u200B" }
                                )
                                .setThumbnail(
                                    `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/${datasumm.profileIconId}.png`
                                )
                                .setTimestamp()

                                .setColor("#0099ff")
                                .setFooter({
                                    text: process.env.NAME_BOT,
                                    iconURL: client.user.displayAvatarURL()
                                });

                            return interaction.reply({
                                embeds: [embed1, embed2]
                            });
                        }
                    })
                    .catch((err) => {
                        interaction.reply(`🔴 Error: ${err}`);
                    });
            });
    }
};
