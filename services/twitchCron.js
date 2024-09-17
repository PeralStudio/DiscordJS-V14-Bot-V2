const { EmbedBuilder } = require("discord.js");
const nodeSuperFetch = require("node-superfetch");
const twitch = require("../schemas/twitchSchema");
const deleteOldMsg = require("./deleteOldMsg");
const checkRepeatMsgs = require("./checkRepeatMsgs");
// const cron = require("node-cron");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
dotenv.config();

const twitchCron = async (client, user) => {
    const { TWITCH_CHANNEL_ID, ID_OWNER, GENERAL_CHANNEL_ID } = process.env;
    const versionbot = "AlfanjorBot v2.0 Peralstudio.com";

    const firstLetter = user.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();
    const remainingLetters = user.slice(1);
    const capitalizedUser = firstLetterCap + remainingLetters;

    logger.info(
        `Comprobando Twitch ${capitalizedUser} - (${new Date().toLocaleTimeString("es-ES", {
            timeZone: "Europe/Madrid"
        })})`
    );

    const httpHeaders = {
        "User-Agent": "PerBot"
    };

    const TIMEOUT = 10000;
    let uptime, avatar, viewers, title, game, followCount;

    try {
        uptime = await nodeSuperFetch.get(`https://decapi.me/twitch/uptime/${user}`, {
            headers: httpHeaders,
            timeout: TIMEOUT
        });
        avatar = await nodeSuperFetch.get(`https://decapi.me/twitch/avatar/${user}`, {
            headers: httpHeaders,
            timeout: TIMEOUT
        });
        viewers = await nodeSuperFetch.get(`https://decapi.me/twitch/viewercount/${user}`, {
            headers: httpHeaders,
            timeout: TIMEOUT
        });
        title = await nodeSuperFetch.get(`https://decapi.me/twitch/title/${user}`, {
            headers: httpHeaders,
            timeout: TIMEOUT
        });
        game = await nodeSuperFetch.get(`https://decapi.me/twitch/game/${user}`, {
            headers: httpHeaders,
            timeout: TIMEOUT
        });
        followCount = await nodeSuperFetch.get(`https://decapi.me/twitch/followcount/${user}`, {
            headers: httpHeaders,
            timeout: TIMEOUT
        });
    } catch (e) {
        logger.error(`Error al obtener datos de Twitch para ${user}: ${e}`);
        return;
    }

    function durationToPastTimestamp(durationStr) {
        const durationParts = durationStr.split(",").map((part) => part.trim());

        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        durationParts.forEach((part) => {
            if (part.includes("hour")) {
                hours = parseInt(part);
            } else if (part.includes("minute")) {
                minutes = parseInt(part);
            } else if (part.includes("second")) {
                seconds = parseInt(part);
            }
        });

        const durationInMs = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;

        const currentDate = new Date();

        const pastDate = new Date(currentDate.getTime() - durationInMs);

        const timestamp = pastDate.getTime();

        return Math.floor(timestamp / 1000);
    }

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
                    value: `⠀${followCount.body.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
                    inline: true
                }
            )
            .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-1920x1080.jpg`)
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
                        "\n<:twitch2:1283532889572511795>¡**`" +
                        capitalizedUser +
                        "`** esta en directo jugando a **`" +
                        game.body +
                        "`**! \n" +
                        `🔴 En directo <t:${durationToPastTimestamp(
                            uptime.text
                        )}:R>\nhttps://twitch.tv/${user}`,
                    embeds: [embed]
                });

                return await newData.save();
            } else {
                await client.channels.cache.get(TWITCH_CHANNEL_ID).send({
                    content:
                        `<@${ID_OWNER}>` +
                        " \n<:twitch2:1283532889572511795>¡**`" +
                        capitalizedUser +
                        "`** esta en directo jugando a **`" +
                        game.body +
                        "`**! \n" +
                        `🔴 En directo <t:${durationToPastTimestamp(
                            uptime.text
                        )}:R>\nhttps://twitch.tv/${user}`,
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
            content: `<@${ID_OWNER}> \n<:twitch2:1283532889572511795>¡**${capitalizedUser}** esta en directo jugando a **${
                game.body
            }**! \n🔴 En directo <t:${durationToPastTimestamp(
                uptime.text
            )}:R>\nhttps://twitch.tv/${user}`,
            embeds: [embed]
        });

        await twitch.findOneAndUpdate({ user: user }, { titulo: title.body });
    }

    // Delete old messages
    deleteOldMsg(client, TWITCH_CHANNEL_ID);

    // Check messages for chanel and filter the repeated
    await checkRepeatMsgs(client, TWITCH_CHANNEL_ID);
};

module.exports = twitchCron;
