const { joinVoiceChannel, createAudioPlayer } = require("@discordjs/voice");

module.exports = {
    name: "stop-radio",
    description: "Stop radio.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const voiceChannel = interaction.member.voice.channelId;

        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: true,
        });

        const player = createAudioPlayer();

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });

        try {
            player.stop();
            voiceConnection.destroy(player);
        } catch (error) {
            console.log(error);
        } finally {
            interaction
                .editReply({ content: "⏹️ Radio Detenida", ephemeral: true })
                .catch((e) => console.log(e));
        }
    },
};
