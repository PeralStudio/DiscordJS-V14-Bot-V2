const { AttachmentBuilder } = require("discord.js");
require("dotenv").config();
const { Rank } = require("canvacord");
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
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const member = interaction.options.getMember("usuario") || interaction.member;
        let user;

        const guildID = member.guild.id;
        const userID = member.user.id;

        user = await xpSchema.findOne({
            guildID,
            userID,
        });

        if (!user) {
            user = {
                level: 1,
                xp: 0,
            };
        }

        const rank = new Rank()
            .setAvatar(
                member.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })
            )
            .setCurrentXP(user.xp)
            .setLevel(user.level)
            .setRank(0, 0, false)
            .setRequiredXP(user.level * 250)
            .setStatus(member.presence.status || "offline")
            .setProgressBar("#7a2cb2", "COLOR")
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator);

        rank.build().then((data) => {
            interaction.reply({
                files: [new AttachmentBuilder(data, { name: "Rank.png" })],
            });
        });
    },
};
