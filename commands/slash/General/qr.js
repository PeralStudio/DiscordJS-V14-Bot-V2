const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "qr",
    description: "Crear imagen QR",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto para generar QR.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const text = interaction.options.get("texto").value;

        const embed = new EmbedBuilder()
            .setImage(
                encodeURI(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${text}`)
            )
            .setColor("#F48226")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        interaction.reply({ embeds: [embed] });
    }
};
