const { EmbedBuilder, WebhookClient } = require("discord.js");
const client = require("../../index");
const usersDiscordSchema = require("../../schemas/usersDiscordSchema");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_LOGS_CHANNEL
});

module.exports = {
    name: "guildMemberAdd"
};

const imagesRandomHello = [
    "https://pa1.narvii.com/7134/e55a690bf6acab74324da299e923af2c30cd544br1-500-500_hq.gif",
    "https://i.pinimg.com/originals/83/b8/09/83b809857acd41a7bad4935b4734f9fc.gif",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/2fc50159420125.5a2161afb3e4f.gif"
];

client.on("guildMemberAdd", async (member) => {
    const embed = new EmbedBuilder()
        .setTitle(`¡Bienvenido a ${member.guild.name}!`)
        .setDescription(`¡Hola! <@${member.id}>`)
        .setThumbnail(member.user.displayAvatarURL())
        .setImage(imagesRandomHello[Math.floor(Math.random() * imagesRandomHello.length)])
        .setColor("#D4B053")
        .setTimestamp()
        .setFooter({
            text: process.env.NAME_BOT,
            iconURL: client.user.displayAvatarURL()
        });

    client.channels.cache.get(process.env.GENERAL_CHANNEL_ID).send({ embeds: [embed] });

    // Add user to the database when he joins the server
    let dataUserDB = await usersDiscordSchema.findOne({
        id: member.user.id,
        user: member.user.username,
        discriminator: member.user.discriminator
    });

    if (!dataUserDB) {
        dataUserDB = new usersDiscordSchema({
            id: member.user.id,
            user: member.user.username,
            discriminator: member.user.discriminator,
            date: new Date().toLocaleString("es-ES", {
                timeZone: "Europe/Madrid"
            })
        });
        dataUserDB.save();
    }

    // Add role to a user when he joins the server
    member.roles.add("726770857531408404");

    // Send bye message to the logs channel
    const hiEmbed = new EmbedBuilder()
        .setAuthor({
            name: `:wave: ${member.user.username} ha entrado al servidor!`,
            iconURL: member.user.displayAvatarURL({ dynamic: true })
        })
        .setFooter({
            text: `${process.env.NAME_BOT}`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp()
        .setColor("#c9af30");

    return webhook.send({ embeds: [hiEmbed] });
});
