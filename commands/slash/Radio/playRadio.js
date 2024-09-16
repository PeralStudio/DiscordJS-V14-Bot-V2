const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    getVoiceConnection
} = require("@discordjs/voice");
const { EmbedBuilder } = require("discord.js");

const urlRadio = {
    cadenaSer:
        "https://playerservices.streamtheworld.com/api/livestream-redirect/SER_BARCELONA.mp3",
    cadenaDial: "http://live.radioatalaya.fm:8327/stream",
    cadenaCien: "http://flucast-m01-02.flumotion.com/cope/cadena100.mp3",
    catalunyaRadio: "https://shoutcast.ccma.cat/ccma/catalunyaradioHD.mp3",
    flaixFm: "https://nodo05-cloud01.streaming-pro.com:8001/flaixfm.mp3",
    flaixBac: "https://flaixbac.streaming-pro.com:8007/flaixbac.aacp",
    losCuarenta: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40.mp3",
    losCuarentaClassic:
        "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_CLASSIC.mp3",
    ondaCero: "http://stream.ondaceronoroeste.es:8000/stream",
    radioMarca:
        "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOMARCA_NACIONAL.mp3",
    cope: "https://barcelona-copesedes-rrcast.flumotion.com/copesedes/barcelona.mp3",
    esRadio: "http://livestreaming3.esradio.fm/stream64.mp3",
    radiole: "http://streaming.indalteco.net:8005/radiole.mp3",
    activaFm: "http://stream.mediasector.es:8000/activafm-valencia.mp3",
    hitFm: "http://hitfm.kissfmradio.cires21.com/hitfm.mp3",
    rneRadioNacional: "https://dispatcher.rndfnk.com/crtve/rne1/ara/mp3/high"
};

module.exports = {
    name: "play-radio",
    description: "Play radio.",
    type: 1,
    options: [
        {
            type: 3,
            name: "emisoras",
            description: "Emisoras de radio",
            required: true,
            choices: Object.entries(urlRadio).map(([key, url]) => ({
                name: `📻 ${key.replace(/([A-Z])/g, " $1")}`,
                value: url
            }))
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const selectedRadio = interaction.options.get("emisoras").value;
        let radioName = Object.keys(urlRadio).find((key) => urlRadio[key] === selectedRadio);

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`❌ ¡No estás en un canal de voz!`)
                        .setColor("#db1e1e")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                ],
                ephemeral: true
            });
        }

        const voiceChannel = interaction.member.voice.channelId;
        let connection = getVoiceConnection(voiceChannel);

        if (!connection) {
            connection = joinVoiceChannel({
                channelId: voiceChannel,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
        }

        let player = createAudioPlayer();
        let resource = createAudioResource(selectedRadio);

        player.play(resource);
        connection.subscribe(player);

        await interaction.deferReply();

        player.on(AudioPlayerStatus.Playing, async () => {
            await interaction.editReply({
                content: `▶️ Reproduciendo \`${radioName}\``,
                ephemeral: true
            });
        });

        player.on("error", (error) => {
            console.error("Error en el reproductor de audio:", error);
            interaction.followUp({
                content: `❌ Hubo un error al intentar reproducir la radio.`,
                ephemeral: true
            });
        });
    }
};
