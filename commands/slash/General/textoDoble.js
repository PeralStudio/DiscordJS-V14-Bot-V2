const fetch = require("node-fetch");

module.exports = {
    name: "texto-doble",
    description: "Crear Texto Doble.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a crear.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const text = interaction.options.get("texto").value;

        const res = await fetch(`https://api.popcatdev.repl.co/doublestruck?text=${text}`);
        const response = await res.json();

        await interaction.reply({ content: response.text });
    },
};
