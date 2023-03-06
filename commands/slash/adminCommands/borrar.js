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
            required: true
        },
        {
            type: 6,
            name: "usuario",
            description: "Eliminar mensajes de un usuario.",
            required: false
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const { channel, options } = interaction;
        const amount = options.getInteger("nº-mensajes");
        const target = options.getUser("usuario");

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
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        if (amount >= 100) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⚠️  No puedes borrar más de 100 mensajes.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        const messages = await channel.messages.fetch({
            limit: amount + 1
        });
        let singOrPlur = messages.size > 2 ? "mensajes" : "mensaje";

        const res = new EmbedBuilder().setColor(0x5fb041);

        if (target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            if (messages.size <= 0) {
                res.setDescription(`❌ No hay mensajes para borrar.`);
                res.setColor("#EA3939");
                interaction.reply({ embeds: [res], ephemeral: true });
                setTimeout(() => interaction.deleteReply(), 4000);

                return;
            }

            await channel.bulkDelete(filtered).then((messages) => {
                res.setDescription(
                    `✅  Eliminado con exito ${messages.size} ${singOrPlur} de ${target}.`
                );
                interaction.reply({ embeds: [res], ephemeral: true });
                setTimeout(() => interaction.deleteReply(), 4000);
            });
        } else {
            await channel.bulkDelete(amount, true).then((messages) => {
                res.setDescription(
                    `✅  Eliminado con exito ${messages.size} ${singOrPlur} del chat.`
                );
                interaction.reply({ embeds: [res], ephemeral: true });
                setTimeout(() => interaction.deleteReply(), 4000);
            });
        }
    }
};
