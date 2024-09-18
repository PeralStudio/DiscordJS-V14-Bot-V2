const config = require("../config/config.js");
require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger.js");

module.exports = (client) => {
    logger.info("[DATABASE] Connecting to MongoDB...");

    const mongo = process.env.MONGO_URL || config.Handlers.MONGO;
    mongoose.set("strictQuery", false);

    if (!mongo) {
        logger.warn("[WARN] A Mongo URI/URL isn't provided! (Not required)");
    } else {
        mongoose
            .connect(mongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() =>
                logger.gold(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║       Conectado a la base de datos MONGODB!         ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`)
            )
            .catch((e) => logger.error(`Error: ${e}`));
    }
};
