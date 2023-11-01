const { AttachmentBuilder } = require("discord.js");
require("dotenv").config();
const { profileImage } = require("discord-arts");
const xpSchema = require("../../../schemas/xpSchema");

module.exports = {
    name: "nivel",
    description: "Ver tu nivel o de otros miembros.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario para ver nivel.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        await interaction.deferReply();
        const member = interaction.options.getMember("usuario") || interaction.member;
        const member2 = interaction.options.get("usuario");
        let user;

        const guildID = member.guild.id;
        const userID = member.user.id;

        user = await xpSchema.findOne({
            guildID,
            userID
        });

        if (!user) {
            user = {
                level: 1,
                xp: 0
            };
        }

        const ranking = await xpSchema.find({ guildID }).sort({
            level: -1,
            xp: -1
        });
        const position = ranking.findIndex((r) => r.userID == member.id) + 1;

        const profileBuffer = await profileImage(member.id, {
            rankData: {
                currentXp: user.xp,
                requiredXp: user.level * 250,
                level: user.level,
                rank: position,
                autoColorRank: true,
                barColor: "#BB8813",
                levelColor: "#D5D4D5"
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
        const imageAttachment = new AttachmentBuilder(profileBuffer, { name: "rank.png" });

        interaction.editReply({ files: [imageAttachment] });
        return;
    }
};
