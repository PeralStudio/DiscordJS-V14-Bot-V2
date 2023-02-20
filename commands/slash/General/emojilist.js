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
        const emojiList = interaction.guild.emojis.cache
            .map((e) => `${e}ㅤ\`:${e.name}:\``)
            .join("\n");

        if (emojiList) {
            const embed = new EmbedBuilder()
                .setTitle(`**Emojis Disponibles de **\`\`\`${interaction.guild.name}\`\`\``)
                .setDescription(`${emojiList}`)
                .setColor("#D4B053")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL(),
                });

            interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle(
                    `**❌ No Hay Emojis Disponibles en  **\`\`\`${interaction.guild.name}\`\`\``
                )
                .setColor("#D4B053")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL(),
                });

            interaction.reply({ embeds: [embed] });
        }
    },
};
