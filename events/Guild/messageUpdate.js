const { AuditLogEvent, EmbedBuilder, WebhookClient } = require("discord.js");
const client = require("../../index");
const deleteOldMsg = require("../../services/deleteOldMsg");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_LOGS_CHANNEL
});

module.exports = {
    name: "messageUpdate.js"
};

client.on("messageUpdate", async (message) => {
    deleteOldMsg(client, process.env.LOGS_CHANNEL_ID);

    await message.guild
        .fetchAuditLogs({
            type: AuditLogEvent.MessageUpdate
        })
        .then(async (audit) => {
            const entry = audit.entries.first();
            if (!entry || !entry.executor) return;

            if (!message.content) return;
            if (message.author.bot) return;
            if (message.content === message.reactions.message.content) return;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `✒️ Editado por ${message.author}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                })
                .addFields(
                    {
                        name: ` `,
                        value: `Mensaje de ${message.author} ha sido editado en ${message.channel}`
                    },
                    {
                        name: `Mensaje original`,
                        value: `${message.content}`
                    },
                    {
                        name: ` Mensaje nuevo`,
                        value: `${message.reactions.message.content}`
                    }
                )
                .setFooter({
                    text: `Autor: ${message.author.id} | Mensaje ID: ${message.id}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp()
                .setColor("Random");

            webhook.send({ embeds: [embed] });
        });
});
