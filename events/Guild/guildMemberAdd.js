const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const usersDiscordSchema = require("../../schemas/usersDiscordSchema");
require("dotenv").config();

module.exports = {
    name: "guildMemberAdd",
};

client.on("guildMemberAdd", async (member) => {
    const embed = new EmbedBuilder()
        .setTitle(`¡Bienvenido a ${member.guild.name}!`)
        .setDescription(`¡Hola! <@${member.id}>`)
        .setThumbnail(member.user.displayAvatarURL())
        .setImage(
            "https://pa1.narvii.com/7134/e55a690bf6acab74324da299e923af2c30cd544br1-500-500_hq.gif"
        )
        .setColor("#D4B053")
        .setTimestamp()
        .setFooter({
            text: process.env.NAME_BOT,
            iconURL: client.user.displayAvatarURL(),
        });

    client.channels.cache.get(process.env.GENERAL_CHANNEL_ID).send({ embeds: [embed] });

    // AÑADIR USUARIO A LA BASE DE DATOS CUANDO INGRESA AL SERVIDOR
    let dataUserDB = await usersDiscordSchema.findOne({
        id: member.user.id,
        user: member.user.username,
        discriminator: member.user.discriminator,
    });

    if (!dataUserDB) {
        dataUserDB = new usersDiscordSchema({
            id: member.user.id,
            user: member.user.username,
            discriminator: member.user.discriminator,
            date: new Date().toLocaleString("es-ES", {
                timeZone: "Europe/Madrid",
            }),
        });
        dataUserDB.save();
    }

    member.roles.add("726770857531408404");
});
