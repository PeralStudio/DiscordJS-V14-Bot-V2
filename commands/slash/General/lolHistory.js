const { EmbedBuilder, WebhookClient } = require("discord.js");
const fetch = require("node-fetch");
const logger = require("../../../utils/logger");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "lol-history",
    description: "Mostrar información de las ultimas partidas de un invocador",
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
        await interaction.deferReply();

        const summonerName = interaction.options.getString("invocador");
        const tag = interaction.options.getString("tag");

        if (!summonerName || !tag) {
            return interaction.editReply(
                "Por favor, proporciona el nombre del invocador y el tag (ej: Nombre#Tag)."
            );
        }

        const RIOT_API_KEY = process.env.LOL_KEY;
        const ACCOUNT_REGION = "europe";
        const MATCH_REGION = "europe";

        const versionRes = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
        const versions = await versionRes.json();
        currentVersionPatch = versions[0];

        try {
            // 1. Obtener el `puuid` usando el Riot ID
            const accountResponse = await fetch(
                `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}?api_key=${RIOT_API_KEY}`
            );
            const accountData = await accountResponse.json();

            if (!accountData.puuid) {
                return interaction.editReply(
                    "No se encontró el invocador con el Riot ID proporcionado."
                );
            }

            const { puuid } = accountData;

            // 2. Obtener los IDs de las últimas 5 partidas usando el `puuid`
            const matchListResponse = await fetch(
                `https://${MATCH_REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${RIOT_API_KEY}`
            );
            const matchList = await matchListResponse.json();

            if (matchList.length === 0) {
                return interaction.editReply(
                    "No se encontraron partidas recientes para este invocador."
                );
            }

            const embeds = [];
            let index = 1;

            const formatNumber = (number) => {
                if (number >= 1000) {
                    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
                return number.toString();
            };

            // 3. Obtener detalles de cada una de las 5 partidas
            for (const matchId of matchList) {
                const matchDetailsResponse = await fetch(
                    `https://${MATCH_REGION}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
                );
                const matchDetails = await matchDetailsResponse.json();

                const playerDetails = matchDetails.info.participants.find((p) => p.puuid === puuid);

                if (!playerDetails) continue;

                const {
                    riotIdGameName,
                    riotIdTagline,
                    profileIcon,
                    kills,
                    deaths,
                    assists,
                    championName,
                    totalDamageDealtToChampions,
                    win,
                    goldEarned,
                    totalDamageTaken,
                    champLevel,
                    totalHeal,
                    physicalDamageDealtToChampions,
                    magicDamageDealtToChampions,
                    trueDamageDealtToChampions,
                    tripleKills,
                    quadraKills,
                    pentaKills,
                    timeCCingOthers,
                    totalTimeCCDealt,
                    longestTimeSpentLiving
                } = playerDetails;
                const { kda } = playerDetails.challenges;

                const result = win ? "🥇Victoria" : "🥈Derrota";

                // Crear un embed para la partida
                const matchEmbed = new EmbedBuilder()
                    .setColor(win ? 0x00ff00 : 0xff0000)
                    .setAuthor({
                        name: `${index} - ${riotIdGameName} #${riotIdTagline}`,
                        iconURL: `https://ddragon.leagueoflegends.com/cdn/${currentVersionPatch}/img/profileicon/${profileIcon}.png`
                    })
                    .setDescription(`Partida: ${matchId}`)
                    .setThumbnail(
                        `https://ddragon.leagueoflegends.com/cdn/${currentVersionPatch}/img/champion/${championName}.png`
                    )
                    .addFields(
                        { name: "Campeón", value: championName, inline: true },
                        { name: "Resultado", value: result, inline: true },
                        { name: "KDA", value: `${kills}/${deaths}/${assists}`, inline: true },
                        {
                            name: "Daño Total",
                            value: formatNumber(totalDamageDealtToChampions).toString(),
                            inline: true
                        },
                        {
                            name: "Daño Recibido",
                            value: formatNumber(totalDamageTaken).toString(),
                            inline: true
                        },
                        {
                            name: "Daño Físico",
                            value: formatNumber(physicalDamageDealtToChampions).toString(),
                            inline: true
                        },
                        {
                            name: "Daño Magico",
                            value: formatNumber(magicDamageDealtToChampions).toString(),
                            inline: true
                        },
                        {
                            name: "Daño Verdadero",
                            value: formatNumber(trueDamageDealtToChampions).toString(),
                            inline: true
                        },
                        {
                            name: "Curación Total",
                            value: formatNumber(totalHeal).toString(),
                            inline: true
                        },
                        { name: "Triple Kills", value: tripleKills.toString(), inline: true },
                        { name: "Cuadra Kills", value: quadraKills.toString(), inline: true },
                        { name: "Penta Kills", value: pentaKills.toString(), inline: true },
                        { name: "KDA", value: kda.toFixed(1).toString(), inline: true },
                        { name: "Nivel del Campeón", value: champLevel.toString(), inline: true },
                        {
                            name: "Oro Ganado",
                            value: formatNumber(goldEarned).toString(),
                            inline: true
                        },
                        {
                            name: "Max Tiempo Vivo",
                            value: `${Math.fround(longestTimeSpentLiving / 60)
                                .toFixed(1)
                                .toString()} min`,
                            inline: true
                        },
                        {
                            name: "CC Realizado",
                            value: `${Math.fround(totalTimeCCDealt / 60)
                                .toFixed(1)
                                .toString()} min`,
                            inline: true
                        },
                        {
                            name: "CC Recibido",
                            value: `${Math.fround(timeCCingOthers / 60)
                                .toFixed(1)
                                .toString()} min`,
                            inline: true
                        }
                    )
                    .setTimestamp(new Date(matchDetails.info.gameCreation))
                    .setFooter({
                        text: `Duración: ${Math.floor(matchDetails.info.gameDuration / 60)} minutos`
                    });

                embeds.push(matchEmbed);
                index++;
            }

            // Enviar los embeds al canal
            await interaction.editReply({ embeds });
        } catch (e) {
            logger.error(`Error: ${e}`);
            webhook.send(`Error: ${e}`);
            interaction.editReply("Ocurrió un error al obtener la información de las partidas.");
        }
    }
};
