const { DiscordTogether } = require("discord-together");

module.exports = {
    name: "actividad",
    description: "Iniciar actividad.",
    type: 1,
    options: [
        {
            type: 3,
            name: "actividad",
            description: "Selecciona la actividad",
            required: true,
            choices: [
                { name: " ▶️ Youtube", value: "youtube" },
                { name: "🎮 Poker", value: "poker" },
                { name: "🎮 Ajedrez", value: "chess" },
                { name: "🎮 Checkers", value: "checkers" },
                { name: "🎮 Letter", value: "lettertile" },
                { name: "🎮 Spellcast", value: "spellcast" },
                { name: "🎮 Ocho", value: "ocho" }
            ]
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        client.discordTogether = new DiscordTogether(client);
        const selected = interaction.options.get("actividad").value;

        if (interaction.member.voice.channel !== null) {
            client.discordTogether
                .createTogetherCode(interaction.member.voice.channel.id, selected)
                .then(async (invite) => {
                    return interaction.reply(`${invite.code}`);
                });
        } else {
            return interaction.reply({
                content: "Debes estar en un canal de voz.",
                ephemeral: true
            });
        }
    }
};
