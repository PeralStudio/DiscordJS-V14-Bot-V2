const { EmbedBuilder } = require("discord.js");
const SoundBoard = require("djs-soundboard");

module.exports = {
    name: "sonidos",
    description: "Efectos de Sonido.",
    type: 1,
    options: [
        {
            type: 3,
            name: "audios",
            description: "Audios disponibles",
            required: true,
            choices: [
                { name: "🔊 And his name is john cena", value: "and-his-name-is-john-cena-1" },
                { name: "🔊 Bruh", value: "bruh" },
                { name: "🔊 Discord notification", value: "discord-notification" },
                { name: "🔊 Error", value: "error" },
                { name: "🔊 Female orgasm", value: "female-orgasm" },
                { name: "🔊 Fart", value: "fart" },
                { name: "🔊 Lesgo", value: "lesgo" },
                { name: "🔊 Ok bye", value: "okbye" },
                { name: "🔊 omg", value: "omg" },
                { name: "🔊 Pussy", value: "pussy" },
                { name: "🔊 Shutdown", value: "shutdown" },
                { name: "🔊 Shut up", value: "shutup" },
                { name: "🔊 Tecno blade bruh", value: "tecnobladebruh" },
                { name: "🔊 Villager", value: "villager" },
                { name: "🔊 X-files theme song", value: "x-files-theme-song-copy" },
            ],
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const selectedSound = interaction.options.get("audios").value;

        if (!interaction.member.voice.channelId) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`¡No estás en un canal de voz!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            });

            setTimeout(() => interaction.deleteReply(), 4000);
            return;
        }

        if (
            interaction.guild.members.me.voice.channelId &&
            interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`¡No estás en mi canal de voz!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            });

            setTimeout(() => interaction.deleteReply(), 4000);
            return;
        }

        let sound = new SoundBoard();
        let channel = interaction.member.voice.channel;

        await sound.play(channel, selectedSound);
        await interaction
            .reply({ content: `✅ Audio ${selectedSound} enviado correctamente`, ephemeral: true })
            .catch((e) => console.error);

        setTimeout(() => interaction.deleteReply(), 4000);
    },
};
