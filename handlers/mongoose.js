const config = require("../config/config.js");
require("dotenv").config();
const colors = require("colors");
const superDjs = require("super-djs");
const mongoose = require("mongoose");

module.exports = (client) => {
    console.log(superDjs.colourText("[DATABASE] Connecting to MongoDB...", "yellow"));
    const mongo = process.env.MONGO_URL || config.Handlers.MONGO;
    mongoose.set("strictQuery", false);

    if (!mongo) {
        console.warn("[WARN] A Mongo URI/URL isn't provided! (Not required)");
    } else {
        mongoose
            .connect(mongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() =>
                console.log(
                    superDjs.colourText(
                        `
╔═════════════════════════════════════════════════════╗
║                                                     ║
║       Conectado a la base de datos MONGODB!         ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`,
                        "green"
                    )
                )
            )
            .catch((err) => console.log(err));
    }
};
