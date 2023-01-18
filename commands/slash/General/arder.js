const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "arder",
    description: "Ardiendo en pasión.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario que esta ardiendo.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const arderEmbed = new EmbedBuilder()
            .setDescription(
                `! <@${
                    interaction.options.get("usuario").user.id
                }> esta ardiendo en pasión ! :hot_face: :fire::flame:`
            )
            .setColor("#AA70F8")
            .setImage("https://pa1.narvii.com/6175/9cc89d4baca1ce2779798b5930ab3ddf832a0eee_00.gif")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });
        await interaction.reply({ embeds: [arderEmbed] });
    },
};
