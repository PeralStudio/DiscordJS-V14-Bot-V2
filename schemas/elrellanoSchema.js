const mongoose = require("mongoose");

const elrellanoSchema = new mongoose.Schema({
    title: {
        type: String
    },
    summary: {
        type: String
    },
    videoUrl: {
        type: String
    },
    type: {
        type: String
    },
    date: {
        type: String
    },
    timestamp: {
        type: Number
    }
});

module.exports = mongoose.model("elrellanovideo", elrellanoSchema);
