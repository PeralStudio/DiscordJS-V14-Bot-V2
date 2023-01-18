const ytch = require("yt-channel-info");
const dotenv = require("dotenv");
const youtube = require("../schemas/youtubeSchema");
const deleteOldMsg = require("./deleteOldMsg.js");
const checkRepeatMsgs = require("./checkRepeatMsgs.js");
dotenv.config();

const setIntervalYoutube = async (client, userId) => {
    const { YOUTUBE_CHANNEL_ID, ID_OWNER } = process.env;
    const payload = {
        channelId: userId,
    };
    const { getChannelVideos /* , getChannelInfo */ } = ytch;

    setInterval(async () => {
        //Delete old messages
        deleteOldMsg(client, YOUTUBE_CHANNEL_ID);

        //Check messages for chanel and filter the repeated
        await checkRepeatMsgs(client, YOUTUBE_CHANNEL_ID);

        const ultimoVideo = await getChannelVideos(payload, 0)
            .then((response) => {
                return response.items[0];
            })
            .catch((err) => {
                console.log(err);
            });

        console.log(
            `Comprobando youtube ${userId} - (${new Date().toLocaleTimeString("es-ES", {
                timeZone: "Europe/Madrid",
            })})`
        );

        if (ultimoVideo === undefined) return;

        let data = await youtube.findOne({
            user: ultimoVideo.authorId,
        });

        if (!data) {
            const newData = new youtube({
                user: ultimoVideo.authorId,
                titulo: ultimoVideo.title,
                video_ID: ultimoVideo.videoId,
                date: new Date().toLocaleString("es-ES", {
                    timeZone: "Europe/Madrid",
                }),
            });

            if (ultimoVideo.liveNow === true) {
                await client.channels.cache.get(YOUTUBE_CHANNEL_ID).send({
                    content:
                        `<@${ID_OWNER}> ` +
                        " \n ¡ **`" +
                        ultimoVideo.author +
                        "`** esta en 🔴 `DIRECTO` ! \n https://www.youtube.com/watch?v=" +
                        ultimoVideo.videoId,
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
                        "`** ha subido un `NUEVO VÍDEO` ! \n Duración: `(" +
                        ultimoVideo.durationText +
                        ")` \n https://www.youtube.com/watch?v=" +
                        ultimoVideo.videoId,
                });

                await newData.save();
            }
        } else {
            if (data.titulo === ultimoVideo.title) {
                return;
            } else {
                // FILTRO SI ES MENOR A 60 SEGUNDOS Y NO ES ¡DIRECTO! NO NOTIFICAR
                if (ultimoVideo?.lengthSeconds < 120 && ultimoVideo.liveNow === false) {
                    console.log("Video menor a 60 segundos = short");
                    return;
                }

                if (ultimoVideo.liveNow === true) {
                    await client.channels.cache.get(YOUTUBE_CHANNEL_ID).send({
                        content:
                            `<@${ID_OWNER}> ` +
                            " \n ¡ **`" +
                            ultimoVideo.author +
                            "`** esta en 🔴 `DIRECTO` ! \n https://www.youtube.com/watch?v=" +
                            ultimoVideo.videoId,
                    });

                    await youtube.findOneAndUpdate(
                        {
                            user: ultimoVideo.authorId,
                        },
                        {
                            titulo: ultimoVideo.title,
                            video_ID: ultimoVideo.videoId,
                            date: new Date().toLocaleString("es-ES", {
                                timeZone: "Europe/Madrid",
                            }),
                        }
                    );
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
                            "`** ha subido un `NUEVO VÍDEO` ! \n Duración: `(" +
                            ultimoVideo.durationText +
                            ")` \n https://www.youtube.com/watch?v=" +
                            ultimoVideo.videoId,
                    });

                    await youtube.findOneAndUpdate(
                        {
                            user: ultimoVideo.authorId,
                        },
                        {
                            titulo: ultimoVideo.title,
                            video_ID: ultimoVideo.videoId,
                            date: new Date().toLocaleString("es-ES", {
                                timeZone: "Europe/Madrid",
                            }),
                        }
                    );
                }
            }
        }
    }, 240000);
};

module.exports = setIntervalYoutube;
