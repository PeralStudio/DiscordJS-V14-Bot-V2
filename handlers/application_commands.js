const client = require("../index");
const { PermissionsBitField, Routes, REST } = require("discord.js");
const fs = require("fs");
const logger = require("../utils/logger");

module.exports = (client, config) => {
    logger.info("------------------>> Application commands Handler:");

    let commands = [];

    // Slash commands handler:
    fs.readdirSync("./commands/slash/").forEach((dir) => {
        logger.info("[!] Started loading slash commands...");
        const SlashCommands = fs
            .readdirSync(`./commands/slash/${dir}`)
            .filter((file) => file.endsWith(".js"));

        for (let file of SlashCommands) {
            let pull = require(`../commands/slash/${dir}/${file}`);

            if ((pull.name, pull.description, pull.type == 1)) {
                client.slash_commands.set(pull.name, pull);
                logger.info(
                    `[HANDLER - SLASH(${dir})] Loaded a file: ${pull.name} (#${client.slash_commands.size})`
                );

                commands.push({
                    name: pull.name,
                    description: pull.description,
                    type: pull.type || 1,
                    options: pull.options ? pull.options : null,
                    default_permission: pull.permissions.DEFAULT_PERMISSIONS
                        ? pull.permissions.DEFAULT_PERMISSIONS
                        : null,
                    default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS
                        ? PermissionsBitField.resolve(
                              pull.permissions.DEFAULT_MEMBER_PERMISSIONS
                          ).toString()
                        : null
                });
            } else {
                logger.error(
                    `[HANDLER - SLASH(${dir})] Couldn't load the file ${file}, missing module name value, description, or type isn't 1.`
                );
                continue;
            }
        }
    });

    // User commands handler:
    fs.readdirSync("./commands/user/").forEach((dir) => {
        logger.info("[!] Started loading user commands...");
        const UserCommands = fs
            .readdirSync(`./commands/user/${dir}`)
            .filter((file) => file.endsWith(".js"));

        for (let file of UserCommands) {
            let pull = require(`../commands/user/${dir}/${file}`);

            if ((pull.name, pull.type == 2)) {
                client.user_commands.set(pull.name, pull);
                logger.info(
                    `[HANDLER - USER(${dir})] Loaded a file: ${pull.name} (#${client.user_commands.size})`
                );

                commands.push({
                    name: pull.name,
                    type: pull.type || 2
                });
            } else {
                logger.error(
                    `[HANDLER - USER(${dir})] Couldn't load the file ${file}, missing module name value or type isn't 2.`
                );
                continue;
            }
        }
    });

    // Message commands handler:
    fs.readdirSync("./commands/message/").forEach((dir) => {
        logger.info("[!] Started loading message commands...");
        const UserCommands = fs
            .readdirSync(`./commands/message/${dir}`)
            .filter((file) => file.endsWith(".js"));

        for (let file of UserCommands) {
            let pull = require(`../commands/message/${dir}/${file}`);

            if ((pull.name, pull.type == 3)) {
                client.message_commands.set(pull.name, pull);
                logger.info(
                    `[HANDLER - MESSAGE(${dir})] Loaded a file: ${pull.name} (#${client.user_commands.size})`
                );

                commands.push({
                    name: pull.name,
                    type: pull.type || 3
                });
            } else {
                logger.error(
                    `[HANDLER - MESSAGE(${dir})] Couldn't load the file ${file}, missing module name value or type isn't 2.`
                );
                continue;
            }
        }
    });

    // Registering all the application commands:
    if (!config.Client.ID) {
        logger.error("[CRASH] You need to provide your bot ID in config.js!");
        return process.exit();
    }

    const rest = new REST({ version: "10" }).setToken(config.Client.TOKEN || process.env.TOKEN);

    (async () => {
        logger.info("[HANDLER] Started registering all the application commands.");

        try {
            await rest.put(Routes.applicationCommands(config.Client.ID), { body: commands });

            logger.info("[HANDLER] Successfully registered all the application commands.");
        } catch (e) {
            logger.error(`Error: ${e}`);
        }
    })();
};
