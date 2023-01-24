const {
    Client,
    Partials,
    Collection,
    GatewayIntentBits,
    ActivityType,
    IntentsBitField,
    EmbedBuilder,
} = require("discord.js");
const config = require("./config/config");
require("dotenv").config();

const { Player } = require("discord-player");
const colors = require("colors");
const superDjs = require("super-djs");
const usersToAlertTwitch = require("./utils/usersToAlertTwitch");
const usersToAlertYoutube = require("./utils/usersToAlertYoutube");
const setIntervalTwitch = require("./functions/setIntervalTwitch");
const setIntervalYoutube = require("./functions/setIntervalYoutube");
const fetchNews = require("./functions/fetchNews");
const epicGamesFree = require("./functions/epicGamesFree");
const elrellanoScrap = require("./functions/elrellanoScrap");

// Creating a new client:
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildPresences,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
    ],
    presence: {
        activities: [
            {
                name: "Achant | /help",
                type: 0,
            },
        ],
        status: "dnd",
    },
});

// Random presence bot
const statusArray = [
    {
        name: `Achant | /help`,
        type: ActivityType.Playing,
        status: "online",
    },
    {
        name: `Double Dragon | /help`,
        type: ActivityType.Playing,
        status: "online",
    },
    {
        name: `Golden Axe | /help`,
        type: ActivityType.Playing,
        status: "dnd",
    },
    {
        name: `El Fary | /help`,
        type: ActivityType.Listening,
        status: "online",
    },
    {
        name: `Gat y Gos | /help`,
        type: ActivityType.Watching,
        status: "idle",
    },
    {
        name: `Vaca y Pollo | /help`,
        type: ActivityType.Watching,
        status: "online",
    },
];
const pickPresence = async () => {
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

for (const user of usersToAlertTwitch) {
    setIntervalTwitch(client, user);
}
for (const user of usersToAlertYoutube) {
    setIntervalYoutube(client, user);
}

//function Scrap Elrellano to show latest videos
elrellanoScrap(client);

//Function epicGamesFree push notifications when new free games
epicGamesFree(client);

//Function to search for news every day
fetchNews(client);

// Host the bot:
require("http")
    .createServer((req, res) => res.end("Ready."))
    .listen(3000);

// Getting the bot token:
const AuthenticationToken = process.env.TOKEN_DISCORD || config.Client.TOKEN;
if (!AuthenticationToken) {
    console.warn(
        superDjs.colourText(
            "[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js.",
            "red"
        )
    );
    return process.exit();
}

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});
client.queueToList = [];

module.exports = client;

["prefix", "application_commands", "modals", "events", "mongoose"].forEach((file) => {
    require(`./handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(AuthenticationToken).catch((err) => {
    console.error(
        superDjs.colourText("[CRASH] Something went wrong while connecting to your bot...", "red")
    );
    console.error(superDjs.colourText("[CRASH] Error from Discord API:", "red" + err));
    return process.exit();
});

// Handle errors:
process.on("unhandledRejection", async (err, promise) => {
    console.log(superDjs.colourText(`[ANTI-CRASH] Unhandled Rejection:  ${err}`, "red"));
    console.error(promise);
});

require(`./handlers/antiCrash`)(client);
