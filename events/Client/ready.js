const { ActivityType, WebhookClient, EmbedBuilder } = require("discord.js");
const client = require("../../index");
const logger = require("../../utils/logger");
require("dotenv").config();

const birthdaysReminder = require("../../services/birthdayReminder");
const usersToAlertTwitch = require("../../utils/usersToAlertTwitch");
const usersToAlertYoutube = require("../../utils/usersToAlertYoutube");
const twitchCron = require("../../services/twitchCron");
const youtubeCron = require("../../services/youtubeCron");
const elrellanoScrap = require("../../services/elrellanoScrap");
const epicGamesFree = require("../../services/epicGamesFree");
const fetchNews = require("../../services/fetchNews");
const reminders = require("../../services/reminders");
const alertLarevuelta = require("../../services/alertLarevuelta");

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
            logger.error(error);
        }
    };

    //function interval Twitch for show new Streams of a user
    setInterval(() => {
        for (const user of usersToAlertTwitch) {
            twitchCron(client, user);
        }
    }, 8 * 60 * 1000);

    //function interval Youtube for show new videos of a user
    setInterval(() => {
        for (const user of usersToAlertYoutube) {
            youtubeCron(client, user);
        }
    }, 6 * 60 * 1000);

    //function Scrap Elrellano to show latest videos
    elrellanoScrap(client);

    //Function epicGamesFree push notifications when new free games
    epicGamesFree(client);

    //Function to search for news every day
    fetchNews(client);

    //Function Birthdays
    birthdaysReminder(client);

    //Funtion Reminders
    reminders(client);

    alertLarevuelta(client);

    setInterval(pickPresence, 60 * 1000);

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

    logger.info(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║     Bot conectado como ${client.user.tag}!            ║
║                    (${new Date().toLocaleTimeString("es-ES", {
        timeZone: "Europe/Madrid"
    })})                       ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`);
});
