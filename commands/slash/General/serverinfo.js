const { EmbedBuilder } = require("discord.js");
const dayjs = require("dayjs");
require("dotenv").config();

module.exports = {
    name: "serverinfo",
    description: "Información del servidor.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const total = interaction.member.guild.memberCount;

        const membersOnline = interaction.member.guild.members.cache.filter(
            (member) => member.presence?.status === "online"
        ).size;

        const memberAusente = interaction.member.guild.members.cache.filter(
            (member) => member.presence?.status === "idle"
        ).size;

        const memberDnd = interaction.member.guild.members.cache.filter(
            (member) => member.presence?.status === "dnd"
        ).size;

        const memberOfline = total - membersOnline - memberAusente - memberDnd;

        const serverInfoEmbed = new EmbedBuilder()
            .setThumbnail(
                interaction.member.guild.iconURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })
            )
            .setAuthor({
                name: interaction.member.guild.name,
                iconURL: interaction.member.guild.iconURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                }),
            })
            .addFields(
                { name: "\u200B", value: "\u200B" },
                {
                    name: "©️ Creado",
                    value: dayjs(interaction.member.guild.createdAt).format("DD/MM/YYYY"),
                    inline: true,
                },
                {
                    name: "💬 Canales",
                    value: `⠀⠀⠀⠀${interaction.member.guild.channels.cache.size.toString()}`,
                    inline: true,
                },
                {
                    name: "👨 Miembros",
                    value: `⠀⠀⠀⠀${total.toString()}`,
                    inline: true,
                },
                { name: "\u200B", value: "\u200B" },
                {
                    name: "🟢 En linea",
                    value: `⠀⠀⠀⠀${membersOnline.toString()}`,
                    inline: true,
                },
                {
                    name: "🟡 Ausentes",
                    value: `⠀⠀⠀⠀⠀${memberAusente.toString()}`,
                    inline: true,
                },
                {
                    name: "🔴 No molestar",
                    value: `⠀⠀⠀⠀⠀${memberDnd.toString()}`,
                    inline: true,
                },
                { name: "\u200B", value: "\u200B" },
                {
                    name: "❌ Offline",
                    value: `⠀⠀⠀${memberOfline.toString()}`,
                    inline: true,
                },
                {
                    name: "👮 Roles",
                    value: `⠀⠀⠀${interaction.member.guild.roles.cache.size.toString()}`,
                    inline: true,
                },
                {
                    name: "🌎 Region",
                    value: `⠀⠀⠀${interaction.member.guild.preferredLocale}`,
                    inline: true,
                },
                { name: "\u200B", value: "\u200B" },
                {
                    name: "📒 Roles",
                    value: `${interaction.member.guild.roles.cache
                        .map((role) => role.name)
                        .sort()
                        .join(", ")}`,
                    inline: true,
                },
                { name: "\u200B", value: "\u200B" }
            )
            .setColor("#AA70F8")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });
        await interaction.reply({ embeds: [serverInfoEmbed] });
    },
};
