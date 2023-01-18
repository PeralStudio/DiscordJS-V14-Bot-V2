const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "enviarmd",
    description: `Enviar un mensaje privado a un usuario como ${process.env.NAME_BOT}`,
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario al que enviar el mensaje.",
            required: true,
        },
        {
            type: 3,
            name: "mensaje",
            description: "Mensaje a enviar.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        if (
            interaction.user.id !== process.env.ID_OWNER &&
            interaction.user.id !== "254135921144758273" &&
            interaction.user.id !== "298585122519908364" &&
            interaction.user.id !== "179686774895935489"
        ) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para enviar mensajes privados.")
                        .setColor("#EA3939"),
                ],
            });
            return;
        }
        const textToSend = interaction.options.get("mensaje").value;
        const userToSend = interaction.options.get("usuario").value;

        //send md to user
        client.users
            .fetch(userToSend)
            .then((user) => {
                user.send(textToSend);
            })
            .catch((err) => {
                interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`⚠️  No se pudo enviar el mensaje. Error: ${err}`)
                            .setColor("#EA3939"),
                    ],
                });
            });

        interaction.reply({
            ephemeral: false,
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `✅  Mensaje enviado correctamente a **${
                            client.users.cache.get(userToSend).username
                        }#${client.users.cache.get(userToSend).discriminator}** .`
                    )
                    .setColor("#EA3939"),
            ],
        });
        setTimeout(() => interaction.deleteReply(), 3000);
    },
};
