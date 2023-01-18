require("dotenv").config();

module.exports = {
    Prefix: process.env.PREFIX,

    Users: {
        OWNERS: [process.env.ID_OWNER], // THE BOT OWNERS ID.
    },

    Handlers: {
        MONGO: process.env.MONGO_URL,
    },

    Client: {
        TOKEN: process.env.TOKEN_DISCORD,
        ID: process.env.CLIENT_ID,
        NAME_BOT: process.env.NAME_BOT,
    },
};
