const mongoose = require("mongoose");

const xpSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    guildID: {
        type: String,
        require: true
    },
    userID: {
        type: String,
        require: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("userxp", xpSchema);
