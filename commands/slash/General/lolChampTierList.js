const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "lol-tierlist",
    description: "Tierlist de campeones de lol",
    type: 1,
    options: [
        {
            type: 3,
            name: "región",
            description: "Elige región.",
            required: true,
            choices: [
                { name: "EUW", value: "euw" },
                { name: "KR", value: "kr" },
                { name: "NA", value: "na" },
                { name: "LAN", value: "lan" },
                { name: "LAS", value: "las" }
            ]
        },
        {
            type: 3,
            name: "división",
            description: "Elige division.",
            required: true,
            choices: [
                { name: "Hierro", value: "iron" },
                { name: "Bronce", value: "bronze" },
                { name: "Plata", value: "silver" },
                { name: "Oro", value: "gold" },
                { name: "Platino", value: "platinum" },
                { name: "Diamante", value: "diamond" },
                { name: "Maestro ", value: "master" }
            ]
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const selectedRegion = interaction.options.data[0].value;
        const selectedRank = interaction.options.data[1].value;
        let image;
        let division;

        switch (selectedRank) {
            case "iron":
                image =
                    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/iron.png";
                division = "Hierro";
                break;
            case "bronze":
                image =
                    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/bronze.png";
                division = "Bronce";
                break;
            case "silver":
                image =
                    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/silver.png";
                division = "Plata";
                break;
            case "gold":
                image =
                    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/gold.png";
                division = "Oro";
                break;
            case "platinum":
                image =
                    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/platinum.png";
                division = "Platino";
                break;
            case "diamond":
                image =
                    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/diamond.png";
                division = "Diamante";
                break;
            case "master":
                image =
                    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/master.png";
                division = "Maestro";
                break;
        }

        const options = {
            method: "GET",
            url: "https://league-of-legends-galore.p.rapidapi.com/api/getChampTierList",
            params: { tier: "s+", region: selectedRegion, rank: selectedRank },
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_SECUNDARY_KEY,
                "X-RapidAPI-Host": "league-of-legends-galore.p.rapidapi.com"
            }
        };

        let embed;
        interaction.deferReply({ content: "Cargando...", ephemeral: true });

        await axios
            .request(options)
            .then(function (response) {
                console.log(response);
                embed = new EmbedBuilder()
                    .setTitle(`${selectedRegion.toUpperCase()} - Campeones tier S+ (${division})`)
                    .addFields(
                        {
                            name: response.data?.sTier[0]?.name,
                            value: `Winrate: ${response.data?.sTier[0]?.winRate}\nPosición: ${response.data?.sTier[0]?.role}`,
                            inline: true
                        },
                        {
                            name: response.data?.sTier[1]?.name,
                            value: `Winrate: ${response.data?.sTier[1]?.winRate}\nPosición: ${response.data?.sTier[1]?.role}`,
                            inline: true
                        },
                        {
                            name: response.data?.sTier[2]?.name,
                            value: `Winrate: ${response.data?.sTier[2]?.winRate}\nPosición: ${response.data?.sTier[2]?.role}`,
                            inline: true
                        },
                        {
                            name: response.data?.sTier[3]?.name,
                            value: `Winrate: ${response.data?.sTier[3]?.winRate}\nPosición: ${response.data?.sTier[3]?.role}`,
                            inline: true
                        },
                        {
                            name: response.data?.sTier[4]?.name,
                            value: `Winrate: ${response.data?.sTier[4]?.winRate}\nPosición: ${response.data?.sTier[4]?.role}`,
                            inline: true
                        },
                        {
                            name: response.data?.sTier[5]?.name,
                            value: `Winrate: ${response.data?.sTier[5]?.winRate}\nPosición: ${response.data?.sTier[5]?.role}`,
                            inline: true
                        }
                    )
                    .setThumbnail(image)
                    .setColor("#0099ff")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client?.user.displayAvatarURL()
                    });
            })
            .catch(function (error) {
                console.error("error", error);
            });

        interaction.editReply({ embeds: [embed], ephemeral: true });
    }
};
