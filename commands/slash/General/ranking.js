const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
require("dotenv").config();
const { profileImage } = require("discord-arts");
const xpSchema = require("../../../schemas/xpSchema");
require("dotenv").config();

module.exports = {
    name: "ranking",
    description: "Ver Ranking de usuarios.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        await interaction.deferReply();
        const guildID = process.env.GUILD_ID;

        const ranking = await xpSchema.find({ guildID }).sort({
            level: -1,
            xp: -1
        });

        const top1 = ranking[0];
        const top2 = ranking[1];
        const top3 = ranking[2];

        // RANK 1
        const position1 = ranking.findIndex((r) => r.userID == top1.userID) + 1;

        const profileBuffer1 = await profileImage(top1.userID, {
            rankData: {
                currentXp: top1.xp,
                requiredXp: top1.level * 250,
                level: top1.level,
                rank: position1,
                autoColorRank: true,
                barColor: "#BB8813",
                levelColor: "#D5D4D5"
            },
            borderColor: ["#cc9900", "#b3b3b3"],
            badgesFrame: true,
            moreBackgroundBlur: true,
            localDateType: "es"
        });

        const imageAttachment1 = new AttachmentBuilder(profileBuffer1, { name: "rank1.png" });

        const embed1 = new EmbedBuilder()
            .setTitle("🥇 RANK 1 🥇")
            .setColor("Random")
            .setImage("attachment://rank1.png");

        // RANK 2
        const position2 = ranking.findIndex((r) => r.userID == top2.userID) + 1;

        const profileBuffer2 = await profileImage(top2.userID, {
            rankData: {
                currentXp: top2.xp,
                requiredXp: top2.level * 250,
                level: top2.level,
                rank: position2,
                autoColorRank: true,
                barColor: "#BB8813",
                levelColor: "#D5D4D5"
            },
            borderColor: ["#cc9900", "#b3b3b3"],
            badgesFrame: true,
            moreBackgroundBlur: true,
            localDateType: "es"
        });

        const imageAttachment2 = new AttachmentBuilder(profileBuffer2, { name: "rank2.png" });

        const embed2 = new EmbedBuilder()
            .setTitle("🥈 RANK 2 🥈")
            .setColor("Random")
            .setImage("attachment://rank2.png");

        // RANK 3
        const position3 = ranking.findIndex((r) => r.userID == top3.userID) + 1;

        const profileBuffer3 = await profileImage(top3.userID, {
            rankData: {
                currentXp: top3.xp,
                requiredXp: top3.level * 250,
                level: top3.level,
                rank: position3,
                autoColorRank: true,
                barColor: "#BB8813",
                levelColor: "#D5D4D5"
            },
            borderColor: ["#cc9900", "#b3b3b3"],
            badgesFrame: true,
            moreBackgroundBlur: true,
            localDateType: "es"
        });

        const imageAttachment3 = new AttachmentBuilder(profileBuffer3, { name: "rank3.png" });

        const embed3 = new EmbedBuilder()
            .setTitle("🥉 RANK 3 🥉")
            .setColor("Random")
            .setImage("attachment://rank3.png");

        await interaction.editReply({
            embeds: [embed1, embed2, embed3],
            files: [imageAttachment1, imageAttachment2, imageAttachment3]
        });

        return;
    }
};
