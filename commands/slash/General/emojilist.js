const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "emoji-list",
    description: "Ver lista de emojis disponibles.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const emojiList3 = interaction.guild.emojis.cache
            .map((e) => `${e}ㅤ\`:${e.name}:\``)
            .join("\n");

        const embed = new EmbedBuilder()
            .setTitle(`Emojis Disponibles`)
            .setDescription(`${emojiList3}`)
            .setColor("#D4B053")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });

        interaction.reply({ embeds: [embed] });
    },
};
