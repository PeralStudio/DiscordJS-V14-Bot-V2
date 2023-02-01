const SoundBoard = require("djs-soundboard");

module.exports = {
    name: "audio",
    description: "Ardiendo en pasión.",
    type: 1,
    options: [
        {
            type: 3,
            name: "audio",
            description: "Audios disponibles",
            required: true,
            choices: [
                { name: "And his name is john cena", value: "and-his-name-is-john-cena-1" },
                { name: "Bruh", value: "bruh" },
                { name: "Discord notification", value: "discord-notification" },
                { name: "Error", value: "error" },
                { name: "Female orgasm", value: "female-orgasm" },
                { name: "Fart", value: "fart" },
                { name: "Lesgo", value: "lesgo" },
                { name: "Ok bye", value: "okbye" },
                { name: "omg", value: "omg" },
                { name: "Pussy", value: "pussy" },
                { name: "Shutdown", value: "shutdown" },
                { name: "Shut up", value: "shutup" },
                { name: "Tecno blade bruh", value: "tecnobladebruh" },
                { name: "Villager", value: "villager" },
                { name: "X-files theme song", value: "x-files-theme-song-copy" },
            ],
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const selectedSound = interaction.options.get("audio").value;

        let sound = new SoundBoard();
        let channel = interaction.member.voice.channel;

        await sound.play(channel, selectedSound);
        await interaction
            .reply({ content: `✅ Audio ${selectedSound} enviado correctamente`, ephemeral: true })
            .catch((e) => console.error);

        setTimeout(() => interaction.deleteReply(), 3000);
    },
};
