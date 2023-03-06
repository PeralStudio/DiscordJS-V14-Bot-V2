const mongoose = require("mongoose");

const playListYoutubeSchema = new mongoose.Schema({
    playListAuthor: {
        type: String
    },
    playListAuthorID: {
        type: String
    },
    playListTitle: {
        type: String
    },
    playlistUrl: {
        type: String
    },
    playListCount: {
        type: Number
    }
});

module.exports = mongoose.model("playListYoutube", playListYoutubeSchema);
