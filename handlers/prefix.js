const fs = require("fs");
const logger = require("../utils/logger");

module.exports = (client, config) => {
    logger.info("------------------>> Prefix Handler:");

    fs.readdirSync("./commands/prefix/").forEach((dir) => {
        const commands = fs
            .readdirSync(`./commands/prefix/${dir}`)
            .filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/prefix/${dir}/${file}`);
            if (pull.config.name) {
                client.prefix_commands.set(pull.config.name, pull);
                logger.info(
                    `[HANDLER - PREFIX(${dir})] Loaded a file: ${pull.config.name} (#${client.prefix_commands.size})`
                );
            } else {
                logger.error(
                    `[HANDLER - PREFIX(${dir})] Couldn't load the file ${file}, missing module name value.`
                );
                continue;
            }
        }
    });
};
