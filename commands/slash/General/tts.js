require("dotenv").config();

module.exports = {
    name: "tts",
    description: "Texto a voz.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a convertir en voz.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        interaction.reply({
            tts: true,
            content: interaction.options.get("texto").value,
        });
    },
};
