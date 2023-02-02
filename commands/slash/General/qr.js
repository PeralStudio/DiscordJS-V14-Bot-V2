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
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const text = interaction.options.get("texto").value;

        const embed = new EmbedBuilder()
            .setImage(
                encodeURI(
                    `https://chart.googleapis.com/chart?chl=${text}&chs=200x200&cht=qr&chld=H%7C0`
                )
            )
            .setColor("#F48226")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });

        interaction.reply({ embeds: [embed] });
    },
};
