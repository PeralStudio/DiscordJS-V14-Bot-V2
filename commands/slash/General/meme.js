const { EmbedBuilder } = require("discord.js");
const red = require("reddit-fetch");
require("dotenv").config();

module.exports = {
    name: "meme",
    description: "Meme random reddit.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        red({
            subreddit: "SpanishMeme",
            sort: "hot",
            allowNSFW: false,
            allowModPost: false,
            allowCrossPost: false,
            allowVideo: false,
        })
            .then((post) => {
                const embed = new EmbedBuilder()
                    .setColor("#AA70F8 ")
                    .setTitle(post.title)
                    .setImage(post.url)
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });
                if (!post.url) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#C28F2C ")
                                .setTitle("No hay memes disponibles")
                                .setDescription("Por favor, intentalo de nuevo mas tarde.")
                                .setTimestamp()
                                .setFooter({
                                    text: process.env.NAME_BOT,
                                    iconURL: client.user.displayAvatarURL(),
                                }),
                        ],
                        ephemeral: true,
                    });
                } else {
                    return interaction.reply({ embeds: [embed] });
                }
            })
            .catch((err) => interaction.reply(`🔴 Error: ${err}`));
    },
};
