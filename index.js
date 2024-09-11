const { Client, Partials, Collection, GatewayIntentBits, IntentsBitField } = require("discord.js");
const config = require("./config/config");
require("dotenv").config();
const { Player } = require("discord-player");
const superDjs = require("super-djs");

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
        GatewayIntentBits.GuildMembers,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildPresences
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ],
    presence: {
        activities: [
            {
                name: "Achant | /help",
                type: 0
            }
        ],
        status: "dnd"
    }
});

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
        highWaterMark: 1 << 25
    }
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
