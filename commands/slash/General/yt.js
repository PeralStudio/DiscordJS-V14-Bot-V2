const { EmbedBuilder } = require("discord.js");
const YouTube = require("youtube-node");
require("dotenv").config();

module.exports = {
    name: "yt",
    description: "Buscar un video en youtube.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a buscar en youtube.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const search = interaction.options.get("texto").value;
        const url = `https://www.youtube.com/results?search_query=${search}`;
        let youTube = new YouTube();

        youTube.setKey(process.env.YOUTUBE_KEY);

        youTube.search(search, 2, function (err, result) {
            if (err) {
                return console.log(err);
            }

            if (result.items.length < 1) {
                return interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("⚠️ No se han encontrado resultados.")
                            .setColor("#EA3939")
                    ]
                });
            } else {
                let link = `https://www.youtube.com/watch?v=${result.items[0]["id"].videoId}`;
                interaction.reply(link);
            }
        });
    }
};
