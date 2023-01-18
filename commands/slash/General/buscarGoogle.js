const google = require("googlethis");
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
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const searchTerm = interaction.options
            .get("búsqueda")
            .value.slice(process.env.PREFIX.length - 1)
            .split(" ")
            .join(" ");

        const options = {
            page: 0,
            safe: false,
            parse_ads: false,
            additional_params: {
                hl: "es",
            },
        };

        const response = await google.search(searchTerm, options);

        if (response.results.length > 3) response.results.length = 3;

        let output = "";
        for (let i = 0; i < response.results.length; i++) {
            const result = response.results[i];
            output += `${result.url}\n`;
        }

        interaction.reply({
            content: output,
            ephemeral: true,
        });
    },
};
