const { AuditLogEvent, EmbedBuilder, WebhookClient } = require("discord.js");
const client = require("../../index");
const deleteOldMsg = require("../../services/deleteOldMsg");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_LOGS_CHANNEL,
});

module.exports = {
    name: "channelDelete.js",
};

client.on("channelDelete", async (channel) => {
    deleteOldMsg(client, process.env.LOGS_CHANNEL_ID);

    channel.guild
        .fetchAuditLogs({
            type: AuditLogEvent.ChannelDelete,
        })
        .then(async (audit) => {
            const { executor } = audit.entries.first();

            let type = channel.type;

            if (type == 0) type = `Texto`;
            if (type == 2) type = `Voz`;
            if (type == 13) type = `Stage`;
            if (type == 15) type = `Foro`;
            if (type == 5) type = `Announcememnt`;
            if (type == 4) type = `Categoria`;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `❌ Canal borrado por ${executor.tag}`,
                    iconURL: executor.displayAvatarURL({ dynamic: true }),
                })
                .addFields(
                    {
                        name: ` `,
                        value: `Nombre del canal: **${channel.name}**`,
                    },
                    {
                        name: ` `,
                        value: `Tipo de canal: **${type}**`,
                    },
                    {
                        name: ` `,
                        value: `ID del canal: **${channel.id}**`,
                    }
                )
                .setFooter({
                    text: `Autor: ${executor.id}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor("#FF0000");

            webhook.send({ embeds: [embed] });
        });
});
