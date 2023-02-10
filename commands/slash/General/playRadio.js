const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const { EmbedBuilder } = require("discord.js");

const urlRadio = {
    cadenaSer:
        "https://playerservices.streamtheworld.com/api/livestream-redirect/SER_BARCELONA.mp3",
    cadenaDial: "http://live.radioatalaya.fm:8327/stream",
    losCuarenta: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40.mp3",
    losCuarentaClassic:
        "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_CLASSIC.mp3",
    cope: "https://barcelona-copesedes-rrcast.flumotion.com/copesedes/barcelona.mp3",
    esRadio: "http://livestreaming3.esradio.fm/stream64.mp3",
    radiole: "http://streaming.indalteco.net:8005/radiole.mp3",
    activaFm: "http://stream.mediasector.es:8000/activafm-valencia.mp3",
    hitFm: "http://hitfm.kissfmradio.cires21.com/hitfm.mp3",
    rneRadioNacional: "https://dispatcher.rndfnk.com/crtve/rne1/ara/mp3/high",
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
            choices: [
                {
                    name: "📻 Cadena Ser",
                    value: urlRadio.cadenaSer,
                },
                {
                    name: "📻 Cadena Dial",
                    value: urlRadio.cadenaDial,
                },
                {
                    name: "📻 Los40",
                    value: urlRadio.losCuarenta,
                },
                {
                    name: "📻 Los40 Classic",
                    value: urlRadio.losCuarentaClassic,
                },
                {
                    name: "📻 Cope",
                    value: urlRadio.cope,
                },
                {
                    name: "📻 EsRadio",
                    value: urlRadio.esRadio,
                },
                {
                    name: "📻 Radiolé",
                    value: urlRadio.radiole,
                },
                {
                    name: "📻 Activa FM",
                    value: urlRadio.activaFm,
                },
                {
                    name: "📻 Hit Fm",
                    value: urlRadio.hitFm,
                },
                {
                    name: "📻 RNE Radio Nacional",
                    value: urlRadio.rneRadioNacional,
                },
            ],
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const selectedRadio = interaction.options.get("emisoras").value;
        let radio;
        let name;

        if (!interaction.member.voice.channelId)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`❌ ¡No estás en un canal de voz!`)
                        .setColor("#db1e1e")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            });

        if (
            interaction.guild.members.me.voice.channelId &&
            interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
        )
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`❌ ¡No estás en mi canal de voz!`)
                        .setColor("#db1e1e")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            });

        switch (selectedRadio) {
            case urlRadio.cadenaSer:
                radio = urlRadio.cadenaSer;
                name = "Cadena Ser";
                break;
            case urlRadio.cadenaDial:
                radio = urlRadio.cadenaDial;
                name = "Cadena Dial";
                break;
            case urlRadio.losCuarenta:
                radio = urlRadio.losCuarenta;
                name = "Los 40";
                break;
            case urlRadio.losCuarentaClassic:
                radio = urlRadio.losCuarentaClassic;
                name = "Los 40 Classic";
                break;
            case urlRadio.cope:
                radio = urlRadio.cope;
                name = "Cope";
                break;
            case urlRadio.esRadio:
                radio = urlRadio.esRadio;
                name = "EsRadio";
                break;
            case urlRadio.radiole:
                radio = urlRadio.radiole;
                name = "Radiolé";
                break;
            case urlRadio.activaFm:
                radio = urlRadio.activaFm;
                name = "Activa FM";
                break;
            case urlRadio.hitFm:
                radio = urlRadio.hitFm;
                name = "Hit Fm";
                break;
            case urlRadio.rneRadioNacional:
                radio = urlRadio.rneRadioNacional;
                name = "RNE Radio Nacional";
                break;
            default:
                radio = urlRadio.cadenaSer;
                name = "Cadena Ser";
                break;
        }

        const voiceChannel = interaction.member.voice.channelId;

        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const resource = createAudioResource(radio, {
            inputType: "stream",
            inlineVolume: true,
        });

        const player = createAudioPlayer();
        voiceConnection.subscribe(player);
        player.play(resource);
        console.log(player);

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });

        // player.on(AudioPlayerStatus.Playing, async () => {
        await interaction
            .editReply({ content: "▶️ Reproduciendo `" + name + "`", ephemeral: true })
            .catch((e) => console.log(e));
        // });
    },
};
