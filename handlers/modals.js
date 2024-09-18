const fs = require("fs");
const logger = require("../utils/logger");

module.exports = (client, config) => {
    logger.info("------------------>> Modals Handler:");

    const modals = fs.readdirSync(`./modals/`).filter((file) => file.endsWith(".js"));

    for (let file of modals) {
        let pull = require(`../modals/${file}`);
        if (pull.id) {
            client.modals.set(pull.id, pull);
            logger.success(`[HANDLER - MODALS] Loaded a file: ${file}`);
        } else {
            logger.error(`[HANDLER - MODALS] Couldn't load the file ${file}. Missing modal ID.`);
            continue;
        }
    }
};
