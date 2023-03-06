const akinator = require("discord.js-akinator");

module.exports = {
    name: "akinator",
    description: "Jugar a Akinator",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        akinator(interaction, {
            language: "es", // Defaults to "en"
            childMode: false, // Defaults to "false"
            gameType: "character", // Defaults to "character"
            useButtons: true, // Defaults to "false"
            embedColor: "#1F1E33" // Defaults to "Random"
        });
    }
};
