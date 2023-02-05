const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const client = require("../../index");
const deleteOldMsg = require("../../services/deleteOldMsg");
require("dotenv").config();

module.exports = {
    name: "roleCreate.js",
};

client.on("roleCreate", async (message) => {
    deleteOldMsg(client, process.env.LOGS_CHANNEL_ID);

    await message.guild
        .fetchAuditLogs({
            type: AuditLogEvent.RoleCreate,
        })
        .then(async (audit) => {
            const authorRole = audit.entries.first().executor;

            const channel = await message.guild.channels.cache.get(process.env.LOGS_CHANNEL_ID);

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Rol Creado por ${authorRole.tag}`,
                    iconURL: authorRole.displayAvatarURL({ dynamic: true }),
                })
                .addFields({
                    name: ` `,
                    value: "El rol `" + message.name + "` ha sido creado en " + message.guild.name,
                })
                .setFooter({
                    text: `Autor: ${authorRole.id} | Canal ID: ${message.id}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor("#04A350");

            channel.send({ embeds: [embed] });
        });
});
