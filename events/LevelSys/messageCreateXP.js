const { AttachmentBuilder } = require("discord.js");
const xpSchema = require("../../schemas/xpSchema");
const client = require("../../index");
const { profileImage } = require("discord-arts");
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

    await interaction.deferReply();

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

            const profileBuffer = await profileImage(member.id, {
                rankData: {
                    currentXp: xp,
                    requiredXp: level * 250,
                    level
                },
                borderColor: ["#cc9900", "#b3b3b3"],
                badgesFrame: true,
                presenceStatus:
                    member2.member.presence?.status == "online"
                        ? "online"
                        : member2.member.presence?.status == "idle"
                        ? "idle"
                        : member2.member.presence?.status == "dnd"
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
    } catch (error) {
        console.log(error);
    }

    coolDown.add(message.author.id);

    setTimeout(() => {
        coolDown.delete(message.author.id);
    }, 10 * 1000);
});
