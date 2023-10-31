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
            required: true
        },
        {
            type: 3,
            name: "mensaje",
            description: "Mensaje a enviar.",
            required: true
        },
        {
            type: 11,
            name: "archivo",
            description: "Adjuntar archivo (opcional)."
        },
        {
            type: 5,
            name: "todos",
            description: "Enviar mensaje a todos. (opcional)"
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para enviar mensajes privados.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }
        const textToSend = interaction.options.get("mensaje").value;
        const userToSend = interaction.options.get("usuario").value;
        const attchToSend = interaction.options.get("archivo")?.attachment?.attachment;
        const sendToAll = interaction.options.get("todos")?.value;

        if (!sendToAll) {
            //send md to user
            client.users
                .fetch(userToSend)
                .then((user) => {
                    user.send({ content: textToSend, files: attchToSend && [attchToSend] });

                    interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `✅  Mensaje enviado correctamente a **${
                                        client.users.cache.get(userToSend).username
                                    }** .`
                                )
                                .setColor("#EA3939")
                        ]
                    });
                    setTimeout(() => interaction.deleteReply(), 3000);
                })
                .catch((err) => {
                    interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`⚠️  No se pudo enviar el mensaje. Error: ${err}`)
                                .setColor("#EA3939")
                        ]
                    });
                });
        }

        //send message to all user in server

        if (sendToAll) {
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            const members = guild.members.fetch();

            members.then((members) => {
                members.forEach((member) => {
                    if (member.bot) return;
                    member.send({ content: textToSend, files: attchToSend && [attchToSend] });
                });
                interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `✅  Mensaje enviado correctamente a todos los usuarios del servidor.`
                            )
                            .setColor("#EA3939")
                    ]
                });
                setTimeout(() => interaction.deleteReply(), 3000);

                return;
            });
        }
    }
};
