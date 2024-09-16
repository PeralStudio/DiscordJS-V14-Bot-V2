const { AttachmentBuilder } = require("discord.js");
require("dotenv").config();
const { profileImage } = require("discord-arts");
const xpSchema = require("../../../schemas/xpSchema");

module.exports = {
    name: "nivel",
    description: "Ver tu nivel o el de otros miembros.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario para ver nivel.",
            required: false
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        await interaction.deferReply();

        // Obtener el miembro especificado o el que ejecuta el comando
        const member = interaction.options.getMember("usuario") || interaction.member;

        // Obtener ID del servidor y del usuario
        const guildID = member.guild.id;
        const userID = member.user.id;

        // Obtener datos de XP del usuario
        let user = await xpSchema.findOne({ guildID, userID });

        if (!user) {
            user = { level: 1, xp: 0 }; // Valor predeterminado si no se encuentra el usuario
        }

        // Obtener el ranking
        const ranking = await xpSchema.find({ guildID }).sort({ level: -1, xp: -1 });
        const position = ranking.findIndex((r) => r.userID == userID) + 1;

        // Generar la imagen de perfil con los datos de rango
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
            presenceStatus: member.presence?.status || "offline", // Uso de estado de presencia del miembro
            moreBackgroundBlur: true,
            localDateType: "es"
        });

        const imageAttachment = new AttachmentBuilder(profileBuffer, { name: "rank.png" });

        // Enviar la respuesta con el archivo adjunto
        interaction.editReply({ files: [imageAttachment] });
    }
};
