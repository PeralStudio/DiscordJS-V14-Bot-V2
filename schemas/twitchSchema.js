const mongoose = require("mongoose");

const twitch = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("twitch", twitch);
