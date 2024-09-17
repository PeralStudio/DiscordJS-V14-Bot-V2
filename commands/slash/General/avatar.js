const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "avatar",
    description: "Muestra el avatar de un usuario.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario a mostrar el avatar.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        await interaction.deferReply();

        const userAvatar = interaction.options.get("usuario").user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024
        });

        const embed = new EmbedBuilder()
            .setColor("#C28F2C")
            .setDescription(`<@${interaction.options.get("usuario").value}>`)
            .setImage(userAvatar)
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });
        await interaction.editReply({ embeds: [embed] });
    }
};
