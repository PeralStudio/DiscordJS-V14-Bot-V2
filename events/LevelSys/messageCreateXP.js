const { AttachmentBuilder } = require("discord.js");
const xpSchema = require("../../schemas/xpSchema");
const client = require("../../index");
const { Rank } = require("canvacord");
require("dotenv").config();

const coolDown = new Set();

module.exports = {
    name: "messageCreateXP",
};

client.on("messageCreate", async (message) => {
    const guildID = message.guild?.id;
    const userID = message.author?.id;

    if (message.author.bot /* || message.guild */) return;
    if (coolDown.has(userID)) return;

    let user;

    try {
        const xpAmount = Math.floor(Math.random() * (25 - 15 + 2) + 12);

        user = await xpSchema.findOneAndUpdate(
            {
                guildID,
                userID,
            },
            {
                guildID,
                userID,
                $inc: { xp: xpAmount },
            },
            { upsert: true, new: true }
        );

        let { xp, level } = user;

        if (xp >= level * 250) {
            ++level;
            xp = 0;

            const rank = new Rank()
                .setAvatar(
                    message.author.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                    })
                )
                .setCurrentXP(xp)
                .setLevel(level)
                .setRank(0, 0, false)
                .setRequiredXP(level * 250)
                .setProgressBarTrack("#484B4E", "COLOR")
                .setProgressBar("#7a2cb2", "COLOR")
                .setUsername(message.author.username)
                .setDiscriminator(message.author.discriminator);

            rank.build().then((data) => {
                message.reply({
                    content: `🎉 Enhorabuena has alcanzado el nivel ${level} 🎉`,
                    files: [new AttachmentBuilder(data, { name: "Rank.png" })],
                });
            });
        }

        await xpSchema.updateOne(
            {
                guildID,
                userID,
            },
            {
                level,
                xp,
            }
        );
    } catch (error) {
        console.log(error);
    }

    coolDown.add(message.author.id);

    setTimeout(() => {
        coolDown.delete(message.author.id);
    }, 30 * 1000);
});
