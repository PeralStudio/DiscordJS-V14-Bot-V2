const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const logger = require("../../../utils/logger");
require("dotenv").config();

module.exports = {
    name: "lol",
    description: "Mostrar información de un Invocador.",
    type: 1,
    options: [
        {
            type: 3,
            name: "invocador",
            description: "Invocador a mostrar la información (formato: nombre#etiqueta).",
            required: true
        },
        {
            type: 3,
            name: "tag",
            description: "#tag",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        try {
            await interaction.deferReply();

            // Obtener el nombre de invocador y etiqueta del comando
            const gameName = interaction.options.get("invocador").value;
            const tagLine = interaction.options.get("tag").value;

            if (!gameName || !tagLine) {
                return interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `⚠️ Formato incorrecto. Asegúrate de usar el formato **nombre#etiqueta**.`
                            )
                            .setColor("#EA3939")
                    ]
                });
            }

            // 1. Primera llamada: Obtener el puuid usando el nombre y la etiqueta
            const accountRes = await fetch(
                `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${process.env.LOL_KEY}`
            );

            if (!accountRes.ok) {
                logger.error(`Error al obtener el PUUID del invocador: ${accountRes.status}`);
                return interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `⚠️ No se ha encontrado a **${gameName}#${tagLine}**, comprueba que has escrito correctamente el nombre.`
                            )
                            .setColor("#EA3939")
                    ]
                });
            }

            const accountData = await accountRes.json();
            const puuid = accountData.puuid;

            // 2. Segunda llamada: Obtener el summonerId usando el puuid
            const summonerRes = await fetch(
                `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.LOL_KEY}`
            );

            if (!summonerRes.ok) {
                logger.error(`Error al obtener el summonerId: ${summonerRes.status}`);
                return interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                "⚠️ Ocurrió un error al obtener la información del invocador."
                            )
                            .setColor("#EA3939")
                    ]
                });
            }

            const summonerData = await summonerRes.json();

            const encryptedSummonerId = summonerData.id;

            // 3. Tercera llamada: Obtener la información de ligas usando el summonerId
            const leagueRes = await fetch(
                `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${process.env.LOL_KEY}`
            );

            if (!leagueRes.ok) {
                logger.error(`Error al obtener las ligas: ${leagueRes.status}`);
                return interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                "⚠️ Ocurrió un error al obtener la información de las ligas del invocador."
                            )
                            .setColor("#EA3939")
                    ]
                });
            }

            const leagueData = await leagueRes.json();

            // Si el invocador es UNRANKED
            if (leagueData.length === 0) {
                return interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `ℹ️ El invocador **${gameName}#${tagLine.toUpperCase()}** (${
                                    summonerData.summonerLevel
                                })  es UNRANKED, no hay datos.`
                            )
                            .setColor("#EA3939")
                    ]
                });
            }

            // Si el invocador tiene ligas
            const embeds = leagueData.map((queue) => {
                const { queueType, tier, rank, leaguePoints, wins, losses } = queue;

                return new EmbedBuilder()
                    .setAuthor({
                        name: `${gameName} (${summonerData.summonerLevel})`,
                        iconURL: `https://ddragon.leagueoflegends.com/cdn/13.19.1/img/profileicon/${summonerData.profileIconId}.png`
                    })
                    .addFields(
                        { name: "Tipo de cola", value: queueType.replace(/_/g, " "), inline: true },
                        { name: "📈 División:", value: `${tier} ${rank}`, inline: true },
                        { name: "💯 League Points:", value: `${leaguePoints} LP`, inline: true },
                        { name: "✅ Victorias:", value: `${wins}`, inline: true },
                        { name: "❌ Derrotas:", value: `${losses}`, inline: true },
                        {
                            name: "🏆 Winrate:",
                            value: `${((wins / (wins + losses)) * 100).toFixed(0)}%`,
                            inline: true
                        }
                    )
                    .setThumbnail(
                        `https://ddragon.leagueoflegends.com/cdn/13.19.1/img/profileicon/${summonerData.profileIconId}.png`
                    )
                    .setTimestamp()
                    .setColor("#0099ff")
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });
            });

            return interaction.editReply({ embeds });
        } catch (e) {
            logger.error(`Error general: ${e}`);
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
