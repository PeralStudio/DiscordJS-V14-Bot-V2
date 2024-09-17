const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
require("dotenv").config();
const { profileImage } = require("discord-arts");
const xpSchema = require("../../../schemas/xpSchema");
const logger = require("../../../utils/logger");

module.exports = {
    name: "resetnivel",
    description: "Resetear nivel de usuario.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario al que resetear nivel",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para resetear niveles.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        await interaction.deferReply();
        const member = interaction.options.getMember("usuario");
        const member2 = interaction.options.get("usuario");
        let user;

        const guildID = member.guild.id;
        const userID = member.user.id;

        user = await xpSchema.findOne({
            guildID,
            userID
        });

        try {
            await xpSchema
                .findOneAndUpdate(
                    {
                        user: `${member.user.username}`,
                        guildID,
                        userID
                    },
                    {
                        level: 1,
                        xp: 0
                    },
                    {
                        upsert: true,
                        new: true
                    }
                )
                .then(async () => {
                    newUserXP = await xpSchema.findOne({
                        guildID,
                        userID
                    });

                    const ranking = await xpSchema.find({ guildID }).sort({
                        level: -1,
                        xp: -1
                    });
                    const position = ranking.findIndex((r) => r.userID == userID) + 1;

                    const profileBuffer = await profileImage(userID, {
                        rankData: {
                            currentXp: newUserXP.xp,
                            requiredXp: newUserXP.level * 250,
                            level: newUserXP.level,
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

                    const imageAttachment = new AttachmentBuilder(profileBuffer, {
                        name: "rank.png"
                    });

                    interaction.editReply({
                        content: `El Nivel de <@${member.user.id}> ha sido reseteado correctamente`,
                        files: [imageAttachment]
                    });
                });
        } catch (error) {
            logger.error(error);
        }
    }
};
