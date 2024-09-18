const fs = require("fs");
const logger = require("../utils/logger");

module.exports = (client) => {
    logger.info("------------------>> Events Handler:");

    fs.readdirSync("./events/").forEach((dir) => {
        const commands = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../events/${dir}/${file}`);
            if (pull.name) {
                client.events.set(pull.name, pull);
                logger.success(`[HANDLER - EVENTS(${dir})] Loaded a file: ${pull.name}`);
            } else {
                logger.error(
                    `[HANDLER - EVENTS(${dir})] Couldn't load the file ${file}. missing name or aliases.`
                );
                continue;
            }
        }
    });
};
