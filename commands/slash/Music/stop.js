const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "stop",
    description: "Parar la reproducción.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`¡No hay ninguna canción reproduciendose!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                ],
                ephemeral: true
            });

        queue.destroy();
        client.queueToList = [];

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`⏹️ ¡Reproducción detenida!`)
                    .setColor("#EA3939")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    })
            ]
        });
    }
};
