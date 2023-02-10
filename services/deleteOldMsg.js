const superDjs = require("super-djs");
const elrellano = require("../schemas/elrellanoSchema");
const dotenv = require("dotenv");
dotenv.config();

const {
    ELRELLANO_CHANNEL_ID,
    YOUTUBE_CHANNEL_ID,
    TWITCH_CHANNEL_ID,
    EPICGAMES_CHANNEL_ID,
    NOTICIAS_CHANNEL_ID,
    ERRORES_BOT_CHANNEL,
    LOGS_CHANNEL_ID,
} = process.env;

const deleteOldMsg = (client, channelID) => {
    let channelName;
    let time;

    switch (channelID) {
        case ELRELLANO_CHANNEL_ID:
            channelName = "🎦-elrellano";
            time = 2 * 1440 * 60 * 1000;
            break;
        case YOUTUBE_CHANNEL_ID:
            channelName = "🔴-alertas-youtube";
            time = 3 * 1440 * 60 * 1000;
            break;
        case TWITCH_CHANNEL_ID:
            channelName = "🟣-alertas-twitch";
            time = 2 * 1440 * 60 * 1000;
            break;
        case EPICGAMES_CHANNEL_ID:
            channelName = "🎮-free-epic-games";
            time = 5 * 1440 * 60 * 1000;
            break;
        case NOTICIAS_CHANNEL_ID:
            channelName = "📰-noticias";
            time = 720 * 60 * 1000;
            break;
        case ERRORES_BOT_CHANNEL:
            channelName = "❌errores-bot🤖";
            time = 360 * 60 * 1000;
            break;
        case LOGS_CHANNEL_ID:
            channelName = "📙-logs";
            time = 2 * 1440 * 60 * 1000;
            break;
    }

    client.channels
        .fetch(channelID)
        .then((channel) => {
            channel.messages
                .fetch({ limit: 42 })
                .then(async (messages) => {
                    const oldMessages = messages.filter((m) => {
                        return m.createdTimestamp < Date.now() - time;
                    });

                    if (oldMessages.size > 0) {
                        //Delete messages channel Discord
                        await channel.bulkDelete(oldMessages);

                        let text1;
                        let text2;
                        let text3;
                        if (oldMessages.size >= 2) {
                            text1 = "Mensajes";
                            text2 = "antiguos";
                            text3 = "borrados";
                        } else {
                            text1 = "Mensaje";
                            text2 = "antiguo";
                            text3 = "borrado";
                        }

                        console.log(
                            superDjs.colourText(
                                `${
                                    oldMessages.size
                                } ${text1} ${text2} ${text3} del canal: ${channelName} (${new Date().toLocaleTimeString(
                                    "es-ES",
                                    {
                                        timeZone: "Europe/Madrid",
                                    }
                                )})`,
                                "yellow"
                            )
                        );

                        if (channelID === ELRELLANO_CHANNEL_ID) {
                            //Delete document MongoDB
                            const oldestDocuments = await elrellano
                                .find({})
                                .sort({ _id: 1 })
                                .limit(oldMessages.size);

                            for (let oldest of oldestDocuments) {
                                await elrellano.deleteOne({ _id: oldest._id });
                            }
                        }
                    }
                })
                .catch(console.error);
        })
        .catch(console.error);
};

module.exports = deleteOldMsg;
