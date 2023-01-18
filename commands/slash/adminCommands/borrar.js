const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "borrar",
    description: "Borrar mensajes.",
    type: 1,
    options: [
        {
            type: 4,
            name: "nº-mensajes",
            description: "Nº de mensajes a borrar.",
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
                        .setDescription("⛔ No tienes permisos para borrar mensajes.")
                        .setColor("#EA3939"),
                ],
            });
            return;
        }

        const amountToDelete = interaction.options.get("nº-mensajes").value;
        const textMsgSingularOrPlural = amountToDelete === 1 ? "mensaje" : "mensajes";
        const textMsg2SingularOrPlural = amountToDelete === 1 ? "ha" : "han";

        if (amountToDelete > 100) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⚠️  No puedes borrar más de 100 mensajes.")
                        .setColor("#EA3939"),
                ],
            });
            return;
        } else {
            interaction.channel.messages
                .fetch({ limit: amountToDelete })
                .then((messages) => {
                    messages.forEach((message) => {
                        message.delete();
                    });
                })
                .catch((err) => {
                    interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`⚠️  No se pudo borrar mensajes. error: ${err}`)
                                .setColor("#EA3939"),
                        ],
                    });
                })
                .finally(() => {
                    interaction.reply(
                        `✅ Se ${textMsg2SingularOrPlural} borrado ${amountToDelete} ${textMsgSingularOrPlural}.`
                    );

                    setTimeout(() => interaction.deleteReply(), 2000);
                });
        }
    },
};
