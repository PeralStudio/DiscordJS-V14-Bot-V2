const { AuditLogEvent, EmbedBuilder, WebhookClient } = require("discord.js");
const client = require("../../index");
const deleteOldMsg = require("../../services/deleteOldMsg");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_LOGS_CHANNEL,
});

module.exports = {
    name: "messageDelete.js",
};

client.on("messageDelete", async (message) => {
    deleteOldMsg(client, process.env.LOGS_CHANNEL_ID);

    await message.guild
        .fetchAuditLogs({
            type: AuditLogEvent.MessageDelete,
        })
        .then(async (audit) => {
            const authorDelete = audit.entries.first().executor;

            if (!message.content) return;
            if (message.author.bot) return;
            if (authorDelete.bot) return;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `🗑️ Borrado por ${authorDelete.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .addFields(
                    {
                        name: ` `,
                        value: `Mensaje de ${message.author} ha sido borrado en ${message.channel}`,
                    },
                    {
                        name: `${message.content}`,
                        value: ` `,
                    }
                )
                .setFooter({
                    text: `Autor: ${message.author.id} | Mensaje ID: ${message.id}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor("#FF0000");

            webhook.send({ embeds: [embed] });
        });
});
