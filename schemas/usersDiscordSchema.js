const mongoose = require("mongoose");

const usersDiscordSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    discriminator: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("user", usersDiscordSchema);
