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

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    deleteOldMsg(client, process.env.LOGS_CHANNEL_ID);

    if (newState.channelId === null) {
        if (oldState.member.user.bot) return;

        const embed = new EmbedBuilder()
            .setDescription(
                ` <@${oldState.member.user.id}> abandonó el canal https://discord.com/channels/${oldState.guild.id}/${oldState.channelId} `
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
                ` <@${newState.member.user.id}> entró al canal https://discord.com/channels/${oldState.guild.id}/${newState.channelId} `
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

        const embed = new EmbedBuilder()
            .setDescription(
                ` <@${oldState.member.user.id}> fué movido del canal https://discord.com/channels/${oldState.guild.id}/${oldState.channelId}  a https://discord.com/channels/${newState.guild.id}/${newState.channelId} `
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
