const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "volumen",
    description: "Cambiar volumen reproducción.",
    type: 1,
    options: [
        {
            type: 3,
            name: "volumen",
            description: "min: 1 - max: 100",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const queue = client.player.getQueue(interaction.guild);
        const volume = interaction.options.get("volumen").value;
        const volumeNunmber = parseInt(volume);
        const iconVolume = volumeNunmber < 50 ? "🔉" : "🔊";

        if (!queue)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`¡No hay ninguna canción reproduciendose!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            });

        queue.setVolume(volume);

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${iconVolume} Volumen: ${volume}%`)
                    .setColor("#EA3939")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    }),
            ],
        });
    },
};
