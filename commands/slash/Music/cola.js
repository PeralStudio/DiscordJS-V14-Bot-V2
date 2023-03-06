const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "cola",
    description: "Ver cola de reproducción.",
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
                        .setTitle(`¡No hay ninguna canción en cola!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                ],
                ephemeral: true
            });

        const embed = new EmbedBuilder()
            .setTitle(`Cola de canciones [${client.queueToList.length}]`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(client.queueToList.map((x, i) => `[${i + 1}] - ${x}`).join("\n\n"))
            .setColor("#0099ff")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });
        return await interaction.reply({ embeds: [embed] });
    }
};
