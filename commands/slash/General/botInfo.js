const { EmbedBuilder, version } = require("discord.js");

module.exports = {
    name: "bot-info",
    description: "Información del bot",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        let osIcon = "";

        if (process.platform.includes("win")) {
            osIcon = "💻";
        }

        if (process.platform.includes("linux")) {
            osIcon = "🐧";
        }

        if (process.platform.includes("darwin" || "mac")) {
            osIcon = "🍎";
        }

        const arderEmbed = new EmbedBuilder()
            .setTitle("ℹ️ Información del bot ℹ️\n")
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: `Nombre del bot: `,
                    value: `${client.user.tag}`,
                    inline: true,
                },
                {
                    name: `Servidores: `,
                    value: `${client.guilds.cache.size} Servers`,
                    inline: true,
                },
                {
                    name: `Viendo: `,
                    value: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Miembros`,
                    inline: true,
                },
                {
                    name: `Prefix: `,
                    value: `${process.env.PREFIX}`,
                    inline: true,
                },
                {
                    name: `Comandos: `,
                    value: `${client.prefix_commands.size + client.slash_commands.size}`,
                    inline: true,
                },
                {
                    name: `Eventos: `,
                    value: `${client.events.size}`,
                    inline: true,
                },
                {
                    name: `Discord.js: `,
                    value: `v${version}`,
                    inline: true,
                },
                {
                    name: `Node.js: `,
                    value: `${process.version}`,
                    inline: true,
                },
                {
                    name: `Plataforma: `,
                    value: `${osIcon} ${process.platform} ${process.arch}`,
                    inline: true,
                },
                {
                    name: `Núcleos: `,
                    value: `${process?.env?.NUMBER_OF_PROCESSORS || "0"}`,
                    inline: true,
                },
                {
                    name: `Uso CPU: `,
                    value: `${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`,
                    inline: true,
                },
                {
                    name: `Memoria: `,
                    value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(
                        process.memoryUsage().rss /
                        1024 /
                        1024
                    ).toFixed(2)}  MB`,
                    inline: true,
                }
            )
            .setColor("#D4B053")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });
        await interaction.reply({ embeds: [arderEmbed] });
    },
};
