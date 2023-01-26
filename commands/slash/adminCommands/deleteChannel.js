const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "borrar-canal",
    description: "Borrar un canal de discord.",
    type: 1,
    options: [
        {
            type: 7,
            name: "canal",
            description: "Selecciona el canal a borrar.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const { options } = interaction;
        const channel = options.getChannel("canal");

        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para cambiar niveles.")
                        .setColor("#EA3939"),
                ],
            });
            return;
        }
        channel.delete();

        await interaction.reply({
            content: "Canal `" + channel.name + "` borrado correctamente.",
            ephemeral: true,
        });
    },
};
