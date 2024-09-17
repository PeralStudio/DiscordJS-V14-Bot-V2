const { EmbedBuilder } = require("discord.js");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const request = require("request");
const logger = require("../../../utils/logger");
require("dotenv").config();

module.exports = {
    name: "lolparche",
    description: "Mostrar notas del parche",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        // Responder inmediatamente a la interacción
        await interaction.deferReply();

        let currentVersionPatch;

        try {
            const versionRes = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
            const versions = await versionRes.json();
            currentVersionPatch = versions[0].slice(0, -2);
        } catch (e) {
            logger.error(`Error: ${e}`);
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#C28F2C")
                        .setTitle("Algo a salido mal")
                        .setDescription("Por favor, intentalo de nuevo mas tarde.")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                ],
                ephemeral: true
            });
        }

        const patchVersionWithDash = currentVersionPatch.replace(".", "-");
        const patchVersionWithDot = currentVersionPatch;

        request(
            `https://www.leagueoflegends.com/es-es/news/game-updates/patch-${patchVersionWithDash}-notes/`,
            async (err, res, html) => {
                if (!err && res.statusCode == 200) {
                    const $ = cheerio.load(html);
                    const imgPathForEmbed = $(".cboxElement")[0]?.attribs?.href;

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#C28F2C")
                                .setTitle(`🗒️ NOTAS DE LA VERSIÓN **${patchVersionWithDot}**`)
                                .setDescription(
                                    `https://www.leagueoflegends.com/es-es/news/game-updates/patch-${patchVersionWithDash}-notes/`
                                )
                                .setThumbnail("https://peralstudio.com/images/lol2-logo.png")
                                .setImage(imgPathForEmbed)
                                .setTimestamp()
                                .setFooter({
                                    text: process.env.NAME_BOT,
                                    iconURL: client.user.displayAvatarURL()
                                })
                        ]
                    });
                } else {
                    getNotes();
                }
            }
        );

        const getNotes = async () => {
            request(
                `https://www.leagueoflegends.com/es-es/news/game-updates/notas-de-la-version-${patchVersionWithDash}/`,
                async (err, res, html) => {
                    if (!err && res.statusCode == 200) {
                        const $ = cheerio.load(html);
                        const imgPathForEmbed = $(".cboxElement")[0]?.attribs?.href;

                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#C28F2C")
                                    .setTitle(`🗒️ NOTAS DE LA VERSIÓN **${patchVersionWithDot}**`)
                                    .setDescription(
                                        `https://www.leagueoflegends.com/es-es/news/game-updates/notas-de-la-version-${patchVersionWithDash}/`
                                    )
                                    .setThumbnail("https://peralstudio.com/images/lol2-logo.png")
                                    .setImage(imgPathForEmbed)
                                    .setTimestamp()
                                    .setFooter({
                                        text: process.env.NAME_BOT,
                                        iconURL: client.user.displayAvatarURL()
                                    })
                            ]
                        });
                    } else {
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#C28F2C")
                                    .setTitle("Algo a salido mal")
                                    .setDescription("Por favor, intentalo de nuevo mas tarde.")
                                    .setTimestamp()
                                    .setFooter({
                                        text: process.env.NAME_BOT,
                                        iconURL: client.user.displayAvatarURL()
                                    })
                            ],
                            ephemeral: true
                        });
                    }
                }
            );
        };
    }
};
