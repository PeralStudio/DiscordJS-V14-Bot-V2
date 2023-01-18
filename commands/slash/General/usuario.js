const { EmbedBuilder } = require("discord.js");
const dayjs = require("dayjs");
require("dotenv").config();

module.exports = {
    name: "usuario",
    description: "Mostar información de un usuario.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario a mostrar la información.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const userAvatar = interaction.options.get("usuario").user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
        });

        const userInfoEmbed = new EmbedBuilder()
            .setThumbnail(userAvatar)
            .setAuthor({
                name:
                    interaction.options.get("usuario").user.username +
                    "#" +
                    interaction.options.get("usuario").user.discriminator,
                iconURL: userAvatar,
            })
            .addFields(
                {
                    name: "Jugando a",
                    value:
                        interaction.options.get("usuario").member?.presence?.activities[0]?.name ||
                        "Nada",
                },
                {
                    name: "Creado",
                    value: dayjs(interaction.options.get("usuario").user.createdAt).format(
                        "DD/MM/YYYY"
                    ),
                    inline: true,
                },
                {
                    name: "Estado",
                    value:
                        interaction.options.get("usuario").member.presence?.status == "online"
                            ? "En linea"
                            : interaction.options.get("usuario").member.presence?.status == "idle"
                            ? "Ausente"
                            : interaction.options.get("usuario").member.presence?.status == "dnd"
                            ? "No molestar"
                            : "Desconectado",
                    inline: true,
                }
            )
            .setColor("#C28F2C")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });
        await interaction.reply({ embeds: [userInfoEmbed] });
    },
};
