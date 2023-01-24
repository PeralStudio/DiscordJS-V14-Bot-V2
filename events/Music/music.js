const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const colors = require("colors");
const superDjs = require("super-djs");
require("dotenv").config();

module.exports = {
    name: "music.js",
};

// add the trackStart event so when a song will be played this message will be sent
client.player.on("trackStart", async (queue, track) => {
    const cancionesSingOrPlur = client.queueToList.length <= 1 ? "canción" : "canciones";
    queue.metadata.channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(
                    `▶ ¡Reproduciendo!\n**${track.title}** \n\nAutor: ${track.author}\nDuración: ${track.duration}`
                )
                .setDescription(
                    "**" +
                        client.queueToList.length +
                        "** " +
                        cancionesSingOrPlur +
                        " en la cola. \nComando: `/cola` para ver la cola de reproducción."
                )
                .setImage(track?.thumbnail)
                .setColor("#EA3939")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL(),
                }),
        ],
    });
});

client.player.on("queueEnd", async (queue, track) => {
    client.queueToList = [];
});
