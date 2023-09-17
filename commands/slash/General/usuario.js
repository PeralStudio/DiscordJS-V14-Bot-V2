const { EmbedBuilder } = require("discord.js");
const dayjs = require("dayjs");
require("dotenv").config();

module.exports = {
    name: "usuario-info",
    description: "Mostar información de un usuario.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario a mostrar la información.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const userAvatar = interaction.options.get("usuario").user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024
        });

        const member = interaction.options.get("usuario") || interaction.member;

        const userInfoEmbed = new EmbedBuilder()
            .setThumbnail(userAvatar)
            .setAuthor({
                name: member.user.username,
                iconURL: userAvatar
            })
            .addFields(
                {
                    name: "Jugando a",
                    value: member.member?.presence?.activities[0]?.name || "Nada"
                },
                {
                    name: "Creado",
                    value: dayjs(member.user.createdAt).format("DD/MM/YYYY"),
                    inline: true
                },
                {
                    name: "Estado",
                    value:
                        member.member.presence?.status == "online"
                            ? "En linea"
                            : member.member.presence?.status == "idle"
                            ? "Ausente"
                            : member.member.presence?.status == "dnd"
                            ? "No molestar"
                            : "Desconectado",
                    inline: true
                },
                {
                    name: "Roles",
                    value:
                        member.member._roles.length > 0
                            ? `${member.member._roles.length}`
                            : "Ninguno",
                    inline: true
                }
            )
            .setColor("#C28F2C")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });
        await interaction.reply({ embeds: [userInfoEmbed] });
    }
};
