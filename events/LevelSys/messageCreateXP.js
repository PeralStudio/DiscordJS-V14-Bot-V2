const { AttachmentBuilder } = require("discord.js");
const xpSchema = require("../../schemas/xpSchema");
const client = require("../../index");
const { profileImage } = require("discord-arts");
const logger = require("../../utils/logger");
require("dotenv").config();

const coolDown = new Set();

module.exports = {
    name: "messageCreateXP"
};

client.on("messageCreate", async (message) => {
    const guildID = message.guild?.id;
    const userID = message.author?.id;
    const username = `${message.author.username}`;
    const channelToSend = client.channels.cache.get(process.env.GENERAL_CHANNEL_ID);

    if (message.author.bot /* || message.guild */) return;
    if (coolDown.has(userID)) return;
    if (!message.guild) return;

    let user;

    try {
        const xpAmount = Math.floor(Math.random() * (25 - 15 + 2) + 12);

        user = await xpSchema.findOneAndUpdate(
            {
                guildID,
                userID
            },
            {
                user: username,
                guildID,
                userID,
                $inc: { xp: xpAmount }
            },
            { upsert: true, new: true }
        );

        let { xp, level } = user;

        if (xp >= level * 250) {
            ++level;
            xp = 0;

            const ranking = await xpSchema.find({ guildID }).sort({
                level: -1,
                xp: -1
            });
            const position = ranking.findIndex((r) => r.userID == userID) + 1;

            const profileBuffer = await profileImage(userID, {
                rankData: {
                    currentXp: xp,
                    requiredXp: level * 250,
                    level,
                    rank: position,
                    autoColorRank: true,
                    barColor: "#BB8813",
                    levelColor: "#D5D4D5"
                },
                borderColor: ["#cc9900", "#b3b3b3"],
                badgesFrame: true,
                presenceStatus:
                    message.guild?.presences.cache.get(userID).status == "online"
                        ? "online"
                        : message.guild?.presences.cache.get(userID).status == "idle"
                        ? "idle"
                        : message.guild?.presences.cache.get(userID).status == "dnd"
                        ? "dnd"
                        : "offline",
                moreBackgroundBlur: true,
                localDateType: "es"
            });

            const imageAttachment = new AttachmentBuilder(profileBuffer, {
                name: "rank.png"
            });

            channelToSend.send({
                content: `🎉 ¡Enhorabuena! <@${message.author.id}> ha alcanzado el nivel ${level} 🎉`,
                files: [imageAttachment]
            });
        }

        await xpSchema.updateOne(
            {
                user: username,
                guildID,
                userID
            },
            {
                level,
                xp
            }
        );
    } catch (e) {
        logger.error(`Error: ${e}`);
    }

    coolDown.add(message.author.id);

    setTimeout(() => {
        coolDown.delete(message.author.id);
    }, 10 * 1000);
});
