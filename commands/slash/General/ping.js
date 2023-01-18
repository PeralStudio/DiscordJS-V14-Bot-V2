const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "ping",
    description: "Calcular ping del bot.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle(
                ":regional_indicator_p: :regional_indicator_i: :regional_indicator_n: :regional_indicator_g:"
            )
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/3883/3883802.png")
            .setDescription(`Ping AlfanjorBot: ${client.ws.ping}ms`)
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });

        interaction.reply({ embeds: [embed] });
    },
};
