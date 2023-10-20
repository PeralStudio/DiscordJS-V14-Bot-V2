const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "bot-avatar",
    description: "Cambiar el avatar del bot.",
    type: 1,
    options: [
        {
            type: 11,
            name: "imagen",
            description: "Adjuntar imagen."
        },
        {
            type: 3,
            name: "url-imagen",
            description: "Url imagen."
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (
            interaction.user.id !== process.env.ID_OWNER &&
            interaction.user.id !== "298585122519908364"
        ) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder().setDescription("⛔ No tienes permisos.").setColor("#EA3939")
                ]
            });
            return;
        }

        const avatarAttch = interaction.options.get("imagen")?.attachment?.attachment;
        const avatarUrl = interaction.options.get("url-imagen")?.value;

        let avatar = avatarAttch ? avatarAttch : avatarUrl;

        await client.user.setAvatar(avatar);

        const embed = new EmbedBuilder()
            .setTitle(`✅  Avatar cambiado correctamente.`)
            .setImage(avatar)
            .setColor("#D4B053");

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
