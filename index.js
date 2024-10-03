const { Client, Partials, Collection, GatewayIntentBits, IntentsBitField } = require("discord.js");
const config = require("./config/config");
require("dotenv").config();
const { Player } = require("discord-player");
const logger = require("./utils/logger");

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
        Partials.Reaction,
        Partials.Flags
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
    logger.warn(
        "[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js."
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
    logger.error("[CRASH] Something went wrong while connecting to your bot...");
    logger.error("[CRASH] Error from Discord API:", "red" + err);
    return process.exit();
});

// Trye upgrade listeners
client.ws._ws.maxListeners = 30;
client.ws._ws._maxListeners = 30;
client.ws._ws.options.rest._maxListeners = 30;
process.setMaxListeners(30);

// Handle errors:
process.on("unhandledRejection", async (reason, promise) => {
    // Registra el error
    logger.error(
        `[ANTI-CRASH] Unhandled Rejection: ${
            reason instanceof Error ? reason.stack || reason.message : reason
        }`
    );

    // Registra el contenido de la promesa si es una promesa no resuelta
    if (promise && typeof promise === "object" && typeof promise.then === "function") {
        // Si es posible, intenta resolver la promesa para registrar su resultado
        try {
            const result = await promise; // Espera la resolución de la promesa
            logger.error(`[ANTI-CRASH] Promise resolved with: ${JSON.stringify(result)}`);
        } catch (err) {
            // Si la promesa también falla, regístralo
            logger.error(
                `[ANTI-CRASH] Promise rejected with: ${
                    err instanceof Error ? err.stack || err.message : err
                }`
            );
        }
    } else {
        // Registra que la promesa no se pudo resolver
        logger.error(`[ANTI-CRASH] Promise was not resolved or is not a valid promise.`);
    }
});

require(`./handlers/antiCrash`)(client);
