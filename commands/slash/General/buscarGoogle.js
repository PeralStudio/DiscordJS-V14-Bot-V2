const googleIt = require("google-it");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "google",
    description: "Buscar en Google.",
    type: 1,
    options: [
        {
            type: 3,
            name: "búsqueda",
            description: "Texto para buscar en Google.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const searchTerm = interaction.options
            .get("búsqueda")
            .value.slice(process.env.PREFIX.length - 1)
            .split(" ")
            .join(" ");
        const { user: author } = interaction;
        let embed;

        await interaction.deferReply({ content: "Cargando..." });

        try {
            const results = await googleIt({ query: searchTerm });
            let index = 0;
            embed = new EmbedBuilder()
                .setAuthor({
                    name: `${client.user.username}`,
                    iconURL: `${client.user.displayAvatarURL()}`
                })
                .setThumbnail(
                    "https://quoly.com/wp-content/uploads/2016/09/Google_-G-_Logo.svg_.png"
                )
                .setTitle(`Resultados de Google para \`\`\`${searchTerm}\`\`\``)
                .setColor("4285F4")
                .setTimestamp()
                .setFooter({
                    text: `${author.username}`,
                    iconURL: author.displayAvatarURL(true)
                })
                .setDescription(
                    results
                        .slice(0, 5)
                        .map((result) => `**${++index}** - [${result.title}](${result.link})\n`)
                        .join("\n")
                );
        } catch (e) {
            console.log(e);
            interaction.editReply({ content: "Busqueda no encontrada", ephemeral: true });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};
