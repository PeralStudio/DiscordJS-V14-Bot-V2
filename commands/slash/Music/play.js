const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "play",
    description: "Elegir canción o Url",
    type: 1,
    options: [
        {
            type: 3,
            name: "cancion",
            description: "Canción o Url",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const query = interaction.options.get("cancion").value;

        if (!interaction.member.voice.channelId)
            return await interaction.reply({
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

        if (
            interaction.guild.members.me.voice.channelId &&
            interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
        )
            return await interaction.reply({
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

        const queue = client.player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel,
            },
            leaveOnEmptyCooldown: 60000,
            leaveOnEmpty: false,
        });

        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`¡No se pudo unir a tu canal de voz!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            });
        }

        await interaction.deferReply();
        const track = await client.player
            .search(query, {
                requestedBy: interaction.user,
            })
            .then((x) => x.tracks[0]);
        if (!track) {
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`❌ ¡Canción **${query}** no encontrada!`)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
            });
        }
        client.queueToList.push(track.title);

        if (client.queueToList.length > 1) {
            queue.addTrack(track);
            const cancionesSingOrPlur = client.queueToList.length > 1 ? "canciones" : "canción";
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            `✅ ¡Canción añadida a la cola! \n**${track.title}**\n\nAutor: ${track.author}\nDuración: ${track.duration}`
                        )
                        .setDescription(
                            "**" +
                                client.queueToList.length +
                                "** " +
                                cancionesSingOrPlur +
                                " en la cola. \nComando: `/cola` para ver la cola de reproducción."
                        )
                        .setThumbnail(track.thumbnail)
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
            });
        } else {
            queue.play(track);
            queue.addTrack(track);

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`⏱️  ¡Cargando canción!\n **${track.title}**`)
                        .setDescription(`**Comandos Disponibles**`)
                        .setThumbnail(track?.thumbnail)
                        .addFields([
                            {
                                name: "`/cola`",
                                value: "Ver la cola de reproducción.",
                            },
                            {
                                name: "`/anterior`",
                                value: "Reproducir la canción anterior.",
                            },
                            {
                                name: "`/siguiente`",
                                value: "Reproducir la canción siguiente.",
                            },
                            {
                                name: "`/pause`",
                                value: "Pausar la reproducción.",
                            },
                            {
                                name: "`/reanudar`",
                                value: "Reanudar la canción actual.",
                            },
                            {
                                name: "`/stop` ",
                                value: "Detener la reproducción.",
                            },
                        ])
                        .setColor("#EA3939")
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL(),
                        }),
                ],
            });
        }
    },
};
