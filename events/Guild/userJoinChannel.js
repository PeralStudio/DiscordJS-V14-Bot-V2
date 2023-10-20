const { EmbedBuilder, WebhookClient, Events } = require("discord.js");
const client = require("../../index");
const deleteOldMsg = require("../../services/deleteOldMsg");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_LOGS_CHANNEL
});

module.exports = {
    name: "userJoinChannel.js"
};

//TODO Borrar mensajes antiguos dletemsg()

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    deleteOldMsg(client, process.env.BOT_DMS_CHANNEL_ID);

    if (newState.channelId === null) {
        if (oldState.member.user.bot) return;

        const embed = new EmbedBuilder()
            .setDescription(
                ` <@${oldState.member.user.id}> 🔴 abandonó el canal https://discord.com/channels/${oldState.guild.id}/${oldState.channelId}`
            )
            .setColor("#AA70F8")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        webhook.send({ embeds: [embed] });
    } else if (oldState.channelId === null) {
        if (oldState.member.user.bot) return;

        const embed = new EmbedBuilder()
            .setDescription(
                ` <@${newState.member.user.id}> 🟢 entró al canal https://discord.com/channels/${oldState.guild.id}/${newState.channelId}`
            )
            .setColor("#AA70F8")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        webhook.send({ embeds: [embed] });
    } else {
        if (oldState.member.user.bot) return;
        if (oldState.channelId === newState.channelId && newState.streaming === true) {
            const embed = new EmbedBuilder()
                .setDescription(
                    ` <@${oldState.member.user.id}> ⏺️ empezó a retransmitir en 👉 https://discord.com/channels/${newState.guild.id}/${newState.channelId}`
                )
                .setColor("#AA70F8")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            webhook.send({ embeds: [embed] });
        }
        if (oldState.streaming === true && newState.streaming === false) {
            const embed = new EmbedBuilder()
                .setDescription(
                    ` <@${oldState.member.user.id}> ⏹️ dejó de retransmitir en 👉 https://discord.com/channels/${newState.guild.id}/${newState.channelId}`
                )
                .setColor("#AA70F8")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            webhook.send({ embeds: [embed] });
        }
        if (oldState.channelId === newState.channelId) return;

        const embed = new EmbedBuilder()
            .setDescription(
                ` <@${oldState.member.user.id}> 🔃 fué movido del canal https://discord.com/channels/${oldState.guild.id}/${oldState.channelId} \n a 👉 https://discord.com/channels/${newState.guild.id}/${newState.channelId}`
            )
            .setColor("#AA70F8")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        webhook.send({ embeds: [embed] });
    }
});
