const { ActivityType } = require("discord.js");
const client = require("../../index");
const superDjs = require("super-djs");
const voiceDiscord = require(`@discordjs/voice`);

module.exports = {
    name: "ready.js",
};

client.once("ready", async () => {
    // Bot enter in voice channel and play radio
    const guild = client.guilds.cache.find((g) => g.id === process.env.GUILD_ID);
    const voiceChannel = "1078266970014752818";

    let SERVER = client.guilds.cache.get(guild.id);

    const connection = voiceDiscord.joinVoiceChannel({
        channelId: voiceChannel,
        guildId: guild.id,
        adapterCreator: SERVER.voiceAdapterCreator,
        selfDeaf: true,
    });

    const player = voiceDiscord.createAudioPlayer();
    const resource = voiceDiscord.createAudioResource("http://stream.laut.fm/lofi", {
        inlineVolume: true,
    });
    resource.volume.setVolume(0.8);

    player.play(resource);
    connection.subscribe(player);

    player.on(voiceDiscord.AudioPlayerStatus.Playing, () => {
        console.log(
            superDjs.colourText(
                `
╔═════════════════════════════════════════════════════╗
║                                                     ║
║     Radio Conectada al canal: ${voiceChannel}   ║
║                                                     ║
║     del servidor: ${guild.name}                        ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`,
                "blue"
            )
        );
    });

    let membersCount = client.guilds.cache
        .map((guild) => guild.memberCount)
        .reduce((a, b) => a + b, 0);

    const pickPresence = async () => {
        // Random presence bot
        const statusArray = [
            // {
            //     name: `Achant | /help`,
            //     type: ActivityType.Playing,
            //     status: "online",
            // },
            // {
            //     name: `Double Dragon | /help`,
            //     type: ActivityType.Playing,
            //     status: "online",
            // },
            // {
            //     name: `Golden Axe | /help`,
            //     type: ActivityType.Playing,
            //     status: "dnd",
            // },
            // {
            //     name: `El Fary | /help`,
            //     type: ActivityType.Listening,
            //     status: "online",
            // },
            // {
            //     name: `Gat y Gos | /help`,
            //     type: ActivityType.Watching,
            //     status: "idle",
            // },
            // {
            //     name: `Vaca y Pollo | /help`,
            //     type: ActivityType.Watching,
            //     status: "online",
            // },
            {
                name: `${membersCount} usuarios 👀`,
                type: ActivityType.Watching,
                status: "online",
            },
            {
                name: `a ${membersCount} usuarios 🎧`,
                type: ActivityType.Listening,
                status: "online",
            },
        ];

        const option = Math.floor(Math.random() * statusArray.length);

        try {
            await client.user.setPresence({
                activities: [
                    {
                        name: statusArray[option].name,
                        type: statusArray[option].type,
                    },
                ],
                status: statusArray[option].status,
            });
        } catch (error) {
            console.log(superDjs.colourText(error), "red");
        }
    };

    setInterval(pickPresence, 60 * 1000);

    console.log(
        superDjs.colourText(
            `
╔═════════════════════════════════════════════════════╗
║                                                     ║
║     Bot conectado como ${client.user.tag}!            ║
║                    (${new Date().toLocaleTimeString("es-ES", {
                timeZone: "Europe/Madrid",
            })})                       ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`,
            "green"
        )
    );
});
