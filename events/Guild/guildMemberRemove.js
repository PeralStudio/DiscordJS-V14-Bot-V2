const { EmbedBuilder, WebhookClient } = require("discord.js");
const client = require("../../index");
// const usersDiscordSchema = require("../../schemas/usersDiscordSchema");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_LOGS_CHANNEL
});

module.exports = {
    name: "guildMemberRemove"
};

const imagesRandomBye = [
    "https://media1.tenor.com/images/59af6d17fa7477ae2379697aa8df134c/tenor.gif",
    "https://media.tenor.com/unaU3uTmQ5YAAAAj/sonic-fnf.gif",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/2fc50159420125.5a2161afb3e4f.gif"
];

client.on("guildMemberRemove", async (member) => {
    const embed = new EmbedBuilder()
        .setTitle("¡Hasta luego! :wave:")
        .setDescription(`<@${member.id}>`)
        .setThumbnail(member.user.displayAvatarURL())
        .setImage(imagesRandomBye[Math.floor(Math.random() * imagesRandomBye.length)])
        .setColor("#D4B053")
        .setTimestamp()
        .setFooter({
            text: process.env.NAME_BOT,
            iconURL: client.user.displayAvatarURL()
        });

    client.channels.cache.get(process.env.GENERAL_CHANNEL_ID).send({ embeds: [embed] });

    // Deleting user from database when user leaves the server

    // let dataUserDB = await usersDiscordSchema.findOne({
    //     id: member.user.id,
    //     user: member.user.username,
    //     discriminator: member.user.discriminator,
    // });

    // if (dataUserDB) {
    //     dataUserDB.remove();
    // }

    // Send bye message to the logs channel
    const byeEmbed = new EmbedBuilder()
        .setAuthor({
            name: `:wave: ${member.user.username} ha dejado el servidor!`,
            iconURL: member.user.displayAvatarURL({ dynamic: true })
        })
        .setFooter({
            text: `${process.env.NAME_BOT}`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp()
        .setColor("#c9af30");

    return webhook.send({ embeds: [byeEmbed] });
});
