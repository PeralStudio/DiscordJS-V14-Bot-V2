const { EmbedBuilder } = require("discord.js");
const cherio = require("cherio");
const fetch = require("node-fetch");
const request = require("request");
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
        let currentVersionPatch;

        await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
            .then((res) => res.json())
            .then((version) => {
                currentVersionPatch = version[0].slice(0, -2);
            })
            .catch((err) => {
                console.log(err);
            });

        const patchVersionWithDash = currentVersionPatch.replace(".", "-");
        const patchVersionWithDot = currentVersionPatch;

        await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
            .then((res) => res.json())
            .then((version) => {
                currentVersion = version[0];
            })
            .catch((err) => {
                console.log(err);
            });

        const currentVersionWithDash = currentVersion.slice(0, -2).replace(".", "-");

        await request(
            `https://www.leagueoflegends.com/es-es/news/game-updates/patch-${patchVersionWithDash}-notes/`,
            (err, res, html) => {
                if (!err && res.statusCode == 200) {
                    const $ = cherio.load(html);
                    // console.log("request ok", $(".cboxElement")[0]?.attribs?.href);
                    const imgPathForEmbed = $(".cboxElement")[0]?.attribs?.href;

                    return interaction.reply({
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
            await request(
                `https://www.leagueoflegends.com/es-es/news/game-updates/notas-de-la-version-${patchVersionWithDash}/`,
                (err, res, html) => {
                    if (!err && res.statusCode == 200) {
                        const $ = cherio.load(html);
                        // console.log("request ok", $(".cboxElement")[0]?.attribs?.href);
                        const imgPathForEmbed = $(".cboxElement")[0]?.attribs?.href;

                        return interaction.reply({
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
                        return interaction.reply({
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
