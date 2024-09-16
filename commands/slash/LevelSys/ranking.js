const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
require("dotenv").config();
const { profileImage } = require("discord-arts");
const xpSchema = require("../../../schemas/xpSchema");

module.exports = {
    name: "ranking",
    description: "Ver Ranking de usuarios.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        await interaction.deferReply();

        try {
            const guildID = process.env.GUILD_ID;

            const ranking = await xpSchema.find({ guildID }).sort({ level: -1, xp: -1 });

            if (ranking.length < 1) {
                return interaction.editReply({
                    content: "❌ No hay datos de ranking disponibles.",
                    ephemeral: true
                });
            }

            // Función para generar imagen y embed
            const createRankEmbed = async (rank, position, color, title) => {
                const profileBuffer = await profileImage(rank.userID, {
                    rankData: {
                        currentXp: rank.xp,
                        requiredXp: rank.level * 250,
                        level: rank.level,
                        rank: position,
                        autoColorRank: true,
                        barColor: "#BB8813",
                        levelColor: "#D5D4D5"
                    },
                    borderColor: ["#cc9900", "#b3b3b3"],
                    badgesFrame: true,
                    moreBackgroundBlur: true,
                    localDateType: "es"
                });
                const imageAttachment = new AttachmentBuilder(profileBuffer, {
                    name: `rank${position}.png`
                });
                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setColor(color)
                    .setImage(`attachment://rank${position}.png`);
                return [embed, imageAttachment]; // Asegúrate de que se devuelvan como array
            };

            // Generar embeds e imágenes para los tres primeros puestos
            const top1 = ranking[0] || {};
            const top2 = ranking[1] || {};
            const top3 = ranking[2] || {};

            const [embed1, imageAttachment1] = await createRankEmbed(
                top1,
                1,
                "#ffd700",
                "🥇 RANK 1 🥇"
            );
            const [embed2, imageAttachment2] = await createRankEmbed(
                top2,
                2,
                "#c0c0c0",
                "🥈 RANK 2 🥈"
            );
            const [embed3, imageAttachment3] = await createRankEmbed(
                top3,
                3,
                "#cd7f32",
                "🥉 RANK 3 🥉"
            );

            await interaction.editReply({
                embeds: [embed1, embed2, embed3],
                files: [imageAttachment1, imageAttachment2, imageAttachment3]
            });
        } catch (error) {
            console.error("Error al ejecutar el comando ranking:", error);
            return interaction.editReply({
                content: "❌ Hubo un error al procesar el comando. Inténtalo de nuevo más tarde.",
                ephemeral: true
            });
        }
    }
};
