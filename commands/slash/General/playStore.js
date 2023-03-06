const { EmbedBuilder } = require("discord.js");
const PlayStore = require("google-play-scraper");
require("dotenv").config();

module.exports = {
    name: "playstore",
    description: "Buscar una App en Playstore",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "App a buscar.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const text = interaction.options.getString("texto");

        PlayStore.search({
            term: text,
            num: 1
        }).then(async (data) => {
            let app;

            try {
                app = JSON.parse(JSON.stringify(data[0]));
            } catch (error) {
                return interaction.reply({
                    content: `No se encontró la app **${text}**`,
                    ephemeral: true
                });
            }

            let embed = new EmbedBuilder()
                .setColor("#4384F4")
                .setThumbnail(app.icon)
                .setURL(app.url)
                .setTitle(`${app.title}`)
                .setDescription(`${app.summary.replace(/<br><br>/g, "\n").replace(/<br>/g, "\n")}`)
                .addFields(
                    {
                        name: `Precio`,
                        value: `${app.free ? "Gratis" : app.price}`,
                        inline: true
                    },
                    {
                        name: `Desarrolador`,
                        value: `${app.developer}`,
                        inline: true
                    },
                    {
                        name: `Valoración`,
                        value: `${app.scoreText}`,
                        inline: true
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            await interaction.reply({ embeds: [embed] });
        });
    }
};
