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

        fetch(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user.username}&text=${text}`)
            .then((res) => res.json())
            .then(async (data) => {
                let embed = new EmbedBuilder()
                    .setImage(`${data.message}`)
                    .setColor("BLUE")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });

                return await interaction.reply({ embeds: [embed], fetchReply: true }).then((m) => {
                    m.react("😀"), m.react("🤣");
                });
            });
    },
};
