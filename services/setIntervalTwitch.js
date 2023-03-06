const { EmbedBuilder } = require("discord.js");
const nodeSuperFetch = require("node-superfetch");
const superDjs = require("super-djs");
const twitch = require("../schemas/twitchSchema");
const deleteOldMsg = require("./deleteOldMsg");
const checkRepeatMsgs = require("./checkRepeatMsgs");
const dotenv = require("dotenv");
dotenv.config();

const setIntervalTwitch = async (client, user) => {
    const { TWITCH_CHANNEL_ID, ID_OWNER } = process.env;
    const versionbot = "AlfanjorBot v2.0 Peralstudio.com";

    const firstLetter = user.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();
    const remainingLetters = user.slice(1);
    const capitalizedUser = firstLetterCap + remainingLetters;

    setInterval(async () => {
        //Delete old messages
        deleteOldMsg(client, TWITCH_CHANNEL_ID);

        //Check messages for chanel and filter the repeated
        await checkRepeatMsgs(client, TWITCH_CHANNEL_ID);

        console.log(
            superDjs.colourText(
                `Comprobando Twitch ${capitalizedUser} - (${new Date().toLocaleTimeString("es-ES", {
                    timeZone: "Europe/Madrid"
                })})`,
                "blue"
            )
        );

        const httpHeaders = {
            "User-Agent": "PerBot"
        };

        const uptime = await nodeSuperFetch.get(`https://decapi.me/twitch/uptime/${user}`, {
            headers: httpHeaders
        });
        const avatar = await nodeSuperFetch.get(`https://decapi.me/twitch/avatar/${user}`, {
            headers: httpHeaders
        });
        const viewers = await nodeSuperFetch.get(`https://decapi.me/twitch/viewercount/${user}`, {
            headers: httpHeaders
        });
        const title = await nodeSuperFetch.get(`https://decapi.me/twitch/title/${user}`, {
            headers: httpHeaders
        });
        const game = await nodeSuperFetch.get(`https://decapi.me/twitch/game/${user}`, {
            headers: httpHeaders
        });
        // const accountCreation = await nodeSuperFetch.get(
        //     `https://decapi.me/twitch/creation/${user}`,
        //     { headers: httpHeaders }
        // );
        const followCount = await nodeSuperFetch.get(
            `https://decapi.me/twitch/followcount/${user}`,
            { headers: httpHeaders }
        );

        if (uptime.text !== `${user} is offline`) {
            let data = await twitch.findOne({
                user: user,
                titulo: title.body
            });

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${capitalizedUser}`,
                    iconURL: `${avatar.body}`
                })
                .setTitle(`${title.body}`)
                .setThumbnail(`${avatar.body}`)
                .setURL(`https://twitch.tv/${user}`)
                .addFields(
                    {
                        name: "Jugando a",
                        value: `${game.body}`,
                        inline: true
                    },
                    {
                        name: "Viewers",
                        value: `⠀${viewers.body}`,
                        inline: true
                    },
                    {
                        name: "Seguidores",
                        value: `⠀${followCount.body
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
                        inline: true
                    }
                )
                .setImage(
                    `https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-1920x1080.jpg`
                )
                .setTimestamp()
                .setFooter({
                    text: versionbot,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor("#AA70F8");

            if (!data) {
                let dataDB = await twitch.findOne({
                    user: user
                });

                if (!dataDB) {
                    const newData = new twitch({
                        user: user,
                        titulo: `${title.body}`,
                        date: new Date().toLocaleString("es-ES", {
                            timeZone: "Europe/Madrid"
                        })
                    });

                    await client.channels.cache.get(TWITCH_CHANNEL_ID).send({
                        content:
                            `<@${ID_OWNER}> ` +
                            "\n ¡ **`" +
                            capitalizedUser +
                            "`** esta en directo jugando a **`" +
                            game.body +
                            "`** ! \n https://twitch.tv/" +
                            user,
                        embeds: [embed]
                    });

                    return await newData.save();
                } else {
                    await client.channels.cache.get(TWITCH_CHANNEL_ID).send({
                        content:
                            `<@${ID_OWNER}> ` +
                            " \n ¡ **`" +
                            capitalizedUser +
                            "`** esta en directo jugando a **`" +
                            game.body +
                            "`** ! \n https://twitch.tv/" +
                            user,
                        embeds: [embed]
                    });

                    return await dataDB.updateOne({
                        user: user,
                        titulo: `${title.body}`,
                        date: new Date().toLocaleString("es-ES", {
                            timeZone: "Europe/Madrid"
                        })
                    });
                }
            }

            if (data.titulo === `${title.body}` && parseInt(uptime.text[0]) > 0) {
                return;
            }

            await client.channels.cache.get(TWITCH_CHANNEL_ID).send({
                content: `<@${ID_OWNER}> \n ¡ **${capitalizedUser}** esta en directo jugando a **${game.body}** ! \n https://twitch.tv/${user}`,
                embeds: [embed]
            });

            await twitch.findOneAndUpdate({ user: user }, { titulo: title.body });
        }
    }, 240000);
};

module.exports = setIntervalTwitch;
