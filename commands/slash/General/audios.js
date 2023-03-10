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
                { name: "π And his name is john cena", value: "and-his-name-is-john-cena-1" },
                { name: "π Bruh", value: "bruh" },
                { name: "π Discord notification", value: "discord-notification" },
                { name: "π Error", value: "error" },
                { name: "π Female orgasm", value: "female-orgasm" },
                { name: "π Fart", value: "fart" },
                { name: "π Lesgo", value: "lesgo" },
                { name: "π Ok bye", value: "okbye" },
                { name: "π omg", value: "omg" },
                { name: "π Pussy", value: "pussy" },
                { name: "π Shutdown", value: "shutdown" },
                { name: "π Shut up", value: "shutup" },
                { name: "π Tecno blade bruh", value: "tecnobladebruh" },
                { name: "π Villager", value: "villager" },
                { name: "π X-files theme song", value: "x-files-theme-song-copy" }
            ]
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const selectedSound = interaction.options.get("audios").value;

        if (!interaction.member.voice.channelId) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Β‘No estΓ‘s en un canal de voz!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                ],
                ephemeral: true
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
                        .setTitle(`Β‘No estΓ‘s en mi canal de voz!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                ],
                ephemeral: true
            });

            setTimeout(() => interaction.deleteReply(), 4000);
            return;
        }

        let sound = new SoundBoard();
        let channel = interaction.member.voice.channel;

        await sound.play(channel, selectedSound);
        await interaction
            .reply({ content: `β Audio ${selectedSound} enviado correctamente`, ephemeral: true })
            .catch((e) => console.error);

        setTimeout(() => interaction.deleteReply(), 4000);
    }
};
