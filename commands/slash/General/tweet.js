const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

module.exports = {
    name: "tweet",
    description: "Crear Tweet.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario del Tweet.",
            required: true,
        },
        {
            type: 3,
            name: "texto",
            description: "Texto del Tweet.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const user = interaction.options.getUser("usuario");
        const text = interaction.options.get("texto").value;

        const headers = {
            "Access-Control-Allow-Origin": "*" /* @dev First, read about security */,
            "Access-Control-Allow-Methods": "OPTIONS, GET",
            "Access-Control-Max-Age": 2592000, // 30 days
            "Content-Type": "application/json; charset=utf-8",
        };

        fetch(
            `https://nekobot.xyz/api/imagegen?type=tweet&username=${user.username}&text=${text}`,
            { method: "GET", headers: headers }
        )
            .then((response) => response.json())
            .then((data) => {
                let embed = new EmbedBuilder()
                    .setImage(`${data.message}`)
                    .setColor("BLUE")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                interaction.reply({ embeds: [embed], fetchReply: true }).then((m) => {
                    m.react("😀"), m.react("🤣");
                });
            });
    },
};
