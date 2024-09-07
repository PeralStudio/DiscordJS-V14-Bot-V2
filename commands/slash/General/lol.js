const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

//!todo Este codigo no funciona hay que recoger primero el encryptedSummonerId con una peticion por nombre y despues buscar la info del perfil con el encryptedSummonerId

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
        // Indicar a Discord que estás procesando la solicitud
        await interaction.deferReply();

        let currentVersion;
        let embed1;
        let embed2;

        try {
            const versionRes = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
            const versions = await versionRes.json();
            currentVersion = versions[0];
        } catch (err) {
            console.error(err);
            return interaction.editReply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "⚠️ No se pudo obtener la versión actual. Inténtalo de nuevo más tarde."
                        )
                        .setColor("#EA3939")
                ]
            });
        }

        const summonerName = interaction.options.get("invocador").value;

        try {
            const summonerRes = await fetch(
                `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.LOL_KEY}`
            );
            const datasumm = await summonerRes.json();

            if (datasumm?.status?.status_code === 404) {
                return interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `⚠️ No se ha encontrado a **${summonerName}**, comprueba que has escrito correctamente el nombre.`
                            )
                            .setColor("#EA3939")
                    ]
                });
            }

            const leagueRes = await fetch(
                `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${datasumm.id}?api_key=${process.env.LOL_KEY}`
            );
            const data = await leagueRes.json();

            if (data.length === 0) {
                return interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `ℹ️ El invocador **${summonerName}** es UNRANKED, no hay datos.`
                            )
                            .setColor("#EA3939")
                    ]
                });
            }

            if (data.length > 0 && data.length < 2) {
                const { queueType, tier, rank, summonerName, leaguePoints, wins, losses } = data[0];

                embed1 = new EmbedBuilder()
                    .setAuthor({
                        name: `${summonerName}`,
                        iconURL: `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/${datasumm.profileIconId}.png`
                    })
                    .addFields(
                        { name: "Tipo de cola", value: queueType },
                        { name: "\u200B", value: "\u200B" },
                        { name: "📈 División:", value: `⠀⠀⠀${tier}`, inline: true },
                        { name: "🏅 Rango:", value: `⠀⠀⠀${rank}`, inline: true },
                        { name: "💯 League Points:", value: `⠀⠀⠀${leaguePoints} LP`, inline: true },
                        { name: "\u200B", value: "\u200B" },
                        { name: "✅ Victorias:", value: `⠀⠀⠀${wins}`, inline: true },
                        { name: "❌ Derrotas:", value: `⠀⠀⠀${losses}`, inline: true },
                        {
                            name: "🏆 Winrate:",
                            value: `⠀⠀⠀${((wins / (wins + losses)) * 100).toFixed(0)}%`,
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

                return interaction.editReply({ embeds: [embed1] });
            }

            if (data.length > 1) {
                embed1 = new EmbedBuilder()
                    .setAuthor({
                        name: `${data[0].summonerName}`,
                        iconURL: `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/${datasumm.profileIconId}.png`
                    })
                    .addFields(
                        { name: "Tipo de cola", value: data[0].queueType },
                        { name: "\u200B", value: "\u200B" },
                        { name: "📈 División:", value: `⠀⠀⠀${data[0].tier}`, inline: true },
                        { name: "🏅 Rango:", value: `⠀⠀⠀${data[0].rank}`, inline: true },
                        {
                            name: "💯 League Points:",
                            value: `⠀⠀⠀${data[0].leaguePoints} LP`,
                            inline: true
                        },
                        { name: "\u200B", value: "\u200B" },
                        { name: "✅ Victorias:", value: `⠀⠀⠀${data[0].wins}`, inline: true },
                        { name: "❌ Derrotas:", value: `⠀⠀⠀${data[0].losses}`, inline: true },
                        {
                            name: "🏆 Winrate:",
                            value: `⠀⠀⠀${(
                                (data[0].wins / (data[0].wins + data[0].losses)) *
                                100
                            ).toFixed(0)}%`,
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
                        { name: "Tipo de cola", value: data[1].queueType },
                        { name: "\u200B", value: "\u200B" },
                        { name: "📈 División:", value: `⠀⠀⠀${data[1].tier}`, inline: true },
                        { name: "🏅 Rango:", value: `⠀⠀⠀${data[1].rank}`, inline: true },
                        {
                            name: "💯 League Points:",
                            value: `⠀⠀⠀${data[1].leaguePoints} LP`,
                            inline: true
                        },
                        { name: "\u200B", value: "\u200B" },
                        { name: "✅ Victorias:", value: `⠀⠀⠀${data[1].wins}`, inline: true },
                        { name: "❌ Derrotas:", value: `⠀⠀⠀${data[1].losses}`, inline: true },
                        {
                            name: "🏆 Winrate:",
                            value: `⠀⠀⠀${(
                                (data[1].wins / (data[1].wins + data[1].losses)) *
                                100
                            ).toFixed(0)}%`,
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

                return interaction.editReply({ embeds: [embed1, embed2] });
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "⚠️ Ocurrió un error al obtener la información del invocador. Inténtalo de nuevo más tarde."
                        )
                        .setColor("#EA3939")
                ]
            });
        }
    }
};
