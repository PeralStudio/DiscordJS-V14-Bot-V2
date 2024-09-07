const ytch = require("yt-channel-info");
const dotenv = require("dotenv");
const superDjs = require("super-djs");
const youtube = require("../schemas/youtubeSchema");
const deleteOldMsg = require("./deleteOldMsg.js");
const checkRepeatMsgs = require("./checkRepeatMsgs.js");
dotenv.config();

const youtubeCron = async (client, userId) => {
    const { YOUTUBE_CHANNEL_ID, ID_OWNER, LOFI_CHANNEL_ID } = process.env;
    const payload = {
        channelId: userId
    };
    const { getChannelVideos } = ytch;

    // Función para convertir 'time ago' a un timestamp Unix
    function parseRelativeTime(publishedText) {
        const now = Math.floor(Date.now() / 1000);
        let secondsToSubtract = 0;

        const timeUnits = {
            second: 1,
            minute: 60,
            hour: 3600,
            day: 86400,
            week: 604800,
            month: 2592000,
            year: 31536000
        };

        const regex = /(\d+)\s(\w+)\sago/;
        const match = publishedText.match(regex);

        if (match) {
            const amount = parseInt(match[1], 10);
            let unit = match[2].replace(/s$/, "");

            if (timeUnits[unit]) {
                secondsToSubtract = amount * timeUnits[unit];
            } else {
                throw new Error(`No se pudo convertir el tiempo: ${publishedText}`);
            }
        } else {
            throw new Error(`No se pudo convertir el tiempo: ${publishedText}`);
        }

        return now - secondsToSubtract;
    }

    const ultimoVideo = await getChannelVideos(payload, 0)
        .then((response) => {
            return response.items[0];
        })
        .catch((err) => {
            console.log(err);
        });

    switch (userId) {
        case "UCg1c09_sFOd-TVPCNgHw8qg":
            userId = "Kerios";
            break;
        case "UCEx9whgAgQPG7e4dAXIq1VQ":
            userId = "ElOjoNinja - Gameplays";
            break;
        case "UCmcBZPvWyXBKw0d6XE5XDOQ":
            userId = "Elyoya";
            break;
        case "UCwXh0iKPlI4hXNntPECFSbg":
            userId = "Zazza el italiano";
            break;
        case "UCNfoPrh2gSZpwijbb9SOKmA":
            userId = "Portillo";
            break;
        case "UCFC19W1bS1Zv73fwgiexm-w":
            userId = "Comiendocondalmau";
            break;
        case "UC9eM3jqq5IfxbGHbuRR_jRw":
            userId = "SFDXShow";
            break;
        case "UCvmKFknIG9Z_tj0ZyMHPViQ":
            userId = "JRBmotors";
            break;
        case "UCNGH2ZZH3gPj0J1Z2HU0ITg":
            userId = "Lofi Serenade Hub";
            break;
        case "UC8rNKrqBxJqL9izOOMxBJtw":
            userId = "Willyrex";
            break;
        case "UC5uFttEUB_fNnJqBly_jRXQ":
            userId = "xFaRgAnx";
            break;
        case "UCtZ-NR6mtwRGRR48AtrYLjg":
            userId = "Nico - Ride Me Five";
            break;
        case "UCv1HX9GgqyAYE999BoGYc1g":
            userId = "Esttik";
            break;
        case "UCuk4lplU8fQIG7CUdJqeZ8g":
            userId = "JDalmau";
            break;
        case "UCiMRXuxr-1wdimyv82y0DvQ":
            userId = "SeVenJungle";
            break;
        case "UCiRgvVzF6kf7fnYCjDYa6Bg":
            userId = "Werlyb - Gameplays";
            break;
        case "UCWcp1Mwm7_bJ-mVoZb8TdkQ":
            userId = "TuberViejuner";
            break;
        case "UCCVPjsqUlFIfDXeWO7V1nLQ":
            userId = "Reven";
            break;
        case "UCWU8fcAN3X8hjMR9k0rbV5g":
            userId = "Nadie Sabe Nada";
            break;
        case "UCzFESlED8MTJOTHpQhxlqGg":
            userId = "FRANK CUESTA - CANAL YOUTUBE";
            break;
        case "UCdKPGAiw0WjT3IeZCkZlz1A":
            userId = "Detección Metálica";
            break;
        default:
            break;
    }

    console.log(
        superDjs.colourText(
            `Comprobando Youtube ${userId} - (${new Date().toLocaleTimeString("es-ES", {
                timeZone: "Europe/Madrid"
            })})`,
            "blue"
        )
    );

    if (ultimoVideo === undefined) return;

    let data = await youtube.findOne({
        user: ultimoVideo.authorId
    });

    if (!data) {
        const newData = new youtube({
            user: ultimoVideo.authorId,
            titulo: ultimoVideo.title,
            video_ID: ultimoVideo.videoId,
            date: new Date().toLocaleString("es-ES", {
                timeZone: "Europe/Madrid"
            })
        });

        if (ultimoVideo.authorId === "UCNGH2ZZH3gPj0J1Z2HU0ITg") {
            await client.channels.cache.get(LOFI_CHANNEL_ID).send({
                content:
                    "¡ **`" +
                    ultimoVideo.author +
                    "`** ha subido un `NUEVO VÍDEO` ! \n Duración: (" +
                    ultimoVideo.durationText +
                    ")" +
                    `\n Fecha: <t:${parseRelativeTime(ultimoVideo.publishedText)}:R>` +
                    "\n https://www.youtube.com/watch?v=" +
                    ultimoVideo.videoId
            });
            await newData.save();

            return;
        }

        if (ultimoVideo.liveNow === true) {
            await client.channels.cache.get(YOUTUBE_CHANNEL_ID).send({
                content:
                    `<@${ID_OWNER}> ` +
                    " \n ¡ **`" +
                    ultimoVideo.author +
                    "`** esta en 🔴 `DIRECTO` !" +
                    `\n Fecha: <t:${parseRelativeTime(ultimoVideo.publishedText)}:R>` +
                    " \n https://www.youtube.com/watch?v=" +
                    ultimoVideo.videoId
            });

            await newData.save();
        } else {
            // FILTRO SI ES MENOR A 60 SEGUNDOS NO NOTIFICAR
            if (ultimoVideo?.lengthSeconds < 120 && ultimoVideo.liveNow === false) {
                return;
            }
            await client.channels.cache.get(YOUTUBE_CHANNEL_ID).send({
                content:
                    `<@${ID_OWNER}> ` +
                    " \n ¡ **`" +
                    ultimoVideo.author +
                    "`** ha subido un `NUEVO VÍDEO` ! \n Duración: (" +
                    ultimoVideo.durationText +
                    ")" +
                    `\n Fecha: <t:${parseRelativeTime(ultimoVideo.publishedText)}:R>` +
                    "\n https://www.youtube.com/watch?v=" +
                    ultimoVideo.videoId
            });

            await newData.save();
        }
    } else {
        if (data.titulo === ultimoVideo.title) {
            return;
        } else {
            if (data.user === "UCNGH2ZZH3gPj0J1Z2HU0ITg") {
                await client.channels.cache.get(LOFI_CHANNEL_ID).send({
                    content: `¡ **\`${
                        ultimoVideo.author
                    }\`** ha subido un \`NUEVO VÍDEO\` ! \n Duración: (${
                        ultimoVideo.durationText
                    })\n Fecha: <t:${parseRelativeTime(
                        ultimoVideo.publishedText
                    )}:R>\n https://www.youtube.com/watch?v=${ultimoVideo.videoId}`
                });

                await youtube.findOneAndUpdate(
                    {
                        user: ultimoVideo.authorId
                    },
                    {
                        titulo: ultimoVideo.title,
                        video_ID: ultimoVideo.videoId,
                        date: new Date().toLocaleString("es-ES", {
                            timeZone: "Europe/Madrid"
                        })
                    }
                );

                return;
            }
            // FILTRO SI ES MENOR A 60 SEGUNDOS Y NO ES ¡DIRECTO! NO NOTIFICAR
            if (ultimoVideo?.lengthSeconds < 120 && ultimoVideo.liveNow === false) {
                console.log("Video menor a 60 segundos = short");
                return;
            }

            if (ultimoVideo.liveNow === true) {
                await client.channels.cache.get(YOUTUBE_CHANNEL_ID).send({
                    content: `<@${ID_OWNER}>  \n ¡ **\`${
                        ultimoVideo.author
                    }\`** esta en 🔴 \`DIRECTO\` !\n Fecha: <t:${parseRelativeTime(
                        ultimoVideo.publishedText
                    )}:R> \n https://www.youtube.com/watch?v=${ultimoVideo.videoId}`
                });

                await youtube.findOneAndUpdate(
                    {
                        user: ultimoVideo.authorId
                    },
                    {
                        titulo: ultimoVideo.title,
                        video_ID: ultimoVideo.videoId,
                        date: new Date().toLocaleString("es-ES", {
                            timeZone: "Europe/Madrid"
                        })
                    }
                );
            } else {
                // FILTRO SI ES MENOR A 60 SEGUNDOS NO NOTIFICAR
                if (ultimoVideo?.lengthSeconds < 120 && ultimoVideo.liveNow === false) {
                    return;
                }
                await client.channels.cache.get(YOUTUBE_CHANNEL_ID).send({
                    content: `<@${ID_OWNER}>  \n ¡ **\`${
                        ultimoVideo.author
                    }\`** ha subido un \`NUEVO VÍDEO\` ! \n Duración: (${
                        ultimoVideo.durationText
                    })\n Fecha: <t:${parseRelativeTime(
                        ultimoVideo.publishedText
                    )}:R>\n https://www.youtube.com/watch?v=${ultimoVideo.videoId}`
                });

                await youtube.findOneAndUpdate(
                    {
                        user: ultimoVideo.authorId
                    },
                    {
                        titulo: ultimoVideo.title,
                        video_ID: ultimoVideo.videoId,
                        date: new Date().toLocaleString("es-ES", {
                            timeZone: "Europe/Madrid"
                        })
                    }
                );
            }
        }
    }

    //Delete old messages
    deleteOldMsg(client, YOUTUBE_CHANNEL_ID);

    //Check messages for chanel and filter the repeated
    await checkRepeatMsgs(client, YOUTUBE_CHANNEL_ID);
    await checkRepeatMsgs(client, LOFI_CHANNEL_ID);
};

module.exports = youtubeCron;
