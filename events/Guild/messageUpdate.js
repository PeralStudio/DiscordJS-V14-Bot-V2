const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const client = require("../../index");
require("dotenv").config();

module.exports = {
    name: "messageUpdate.js",
};

client.on("messageUpdate", async (message) => {
    await message.guild
        .fetchAuditLogs({
            type: AuditLogEvent.MessageUpdate,
        })
        .then(async (audit) => {
            const authorEdit = audit.entries.first().executor;

            if (!message.content) return;
            if (message.author.bot) return;
            // if (authorEdit.bot) return;

            const channel = await message.guild.channels.cache.get(process.env.LOGS_CHANNEL_ID);

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `✒️ Editado por ${authorEdit.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .addFields(
                    {
                        name: ` `,
                        value: `Mensaje de ${message.author} ha sido editado en ${message.channel}`,
                    },
                    {
                        name: `Mensaje original`,
                        value: `${message.content}`,
                    },
                    {
                        name: ` Mensaje nuevo`,
                        value: `${message.reactions.message.content}`,
                    }
                )
                .setFooter({
                    text: `Autor: ${message.author.id} | Mensaje ID: ${message.id}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor("#c9af30");

            channel.send({ embeds: [embed] });
        });
});
