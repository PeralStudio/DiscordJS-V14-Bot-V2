const config = require("../config/config.js");
require("dotenv").config();
const colors = require("colors");
const superDjs = require("super-djs");

module.exports = (client) => {
    console.log(superDjs.colourText("[DATABASE] Connecting to MongoDB...", "yellow"));
    const mongo = process.env.MONGO_URL || config.Handlers.MONGO;

    if (!mongo) {
        console.warn("[WARN] A Mongo URI/URL isn't provided! (Not required)");
    } else {
        superDjs.connectMongoDB(
            mongo,
            true,
            console.log(
                `
╔═════════════════════════════════════════════════════╗
║                                                     ║
║       Conectado a la base de datos MONGODB!         ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.rainbow
            )
        );
    }
};
