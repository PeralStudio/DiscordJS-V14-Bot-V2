const { ActivityType, WebhookClient, EmbedBuilder } = require("discord.js");
const client = require("../../index");
const superDjs = require("super-djs");

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_LOGS_CHANNEL
});

module.exports = {
    name: "ready.js"
};

client.once("ready", async () => {
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
                status: "online"
            },
            {
                name: `a ${membersCount} usuarios 🎧`,
                type: ActivityType.Listening,
                status: "online"
            }
        ];

        const option = Math.floor(Math.random() * statusArray.length);

        try {
            await client.user.setPresence({
                activities: [
                    {
                        name: statusArray[option].name,
                        type: statusArray[option].type
                    }
                ],
                status: statusArray[option].status
            });
        } catch (error) {
            console.log(superDjs.colourText(error), "red");
        }
    };

    setInterval(pickPresence, 60 * 1000);

    // webhook.send({
    //     content: `🟢 <@${client.user.id}> Online \n\n **Estado:** ${client.user.presence.status} \n **Actividad:** ${client.user.presence.activities[0].name} \n **ID:** ${client.user.id} \n`
    // });

    const embed = new EmbedBuilder()
        .setDescription(`🟢 <@${client.user.id}> Online`)
        .addFields(
            {
                name: `Estado:`,
                value: `${client.user.presence.status}`,
                inline: false
            },
            {
                name: `Actividad:`,
                value: `${client.user.presence.activities[0].name}`,
                inline: false
            },
            {
                name: `ID:`,
                value: `${client.user.id}`,
                inline: false
            },
            {
                name: `Fecha de conexión:`,
                value: `${new Date().toLocaleTimeString("es-ES", {
                    timeZone: "Europe/Madrid"
                })}`
            }
        )
        .setColor("#059F03")
        .setTimestamp()
        .setFooter({ text: "Logs" });

    webhook.send({ embeds: [embed] });

    console.log(
        superDjs.colourText(
            `
╔═════════════════════════════════════════════════════╗
║                                                     ║
║     Bot conectado como ${client.user.tag}!            ║
║                    (${new Date().toLocaleTimeString("es-ES", {
                timeZone: "Europe/Madrid"
            })})                       ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`,
            "green"
        )
    );
});
