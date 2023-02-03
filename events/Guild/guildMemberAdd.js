const { AttachmentBuilder } = require("discord.js");
const client = require("../../index");
const Canvas = require("discord-canvas");

module.exports = {
    name: "guildMemberAdd",
};

client.on("guildMemberAdd", async (member) => {
    if (member.guild.id === process.env.GUILD_ID) {
        const image = await new Canvas.Welcome()
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setMemberCount(member.guild.memberCount)
            .setGuildName(member.guild.name)
            .setAvatar(
                member.user.displayAvatarURL({ size: 1024, dynamic: false, extension: "png" })
            )
            .setColor("border", "#8015EA")
            .setColor("username-box", "#8015EA")
            .setColor("discriminator-box", "#8015EA")
            .setColor("message-box", "#8015EA")
            .setColor("title", "#8015EA")
            .setColor("avatar", "#8015EA")
            .setBackground("https://i.postimg.cc/C5kLJdsD/istockphoto-1164222265-612x612.png")
            .toAttachment();

        const attachment = new AttachmentBuilder(image.toBuffer(), "goodbye-image.png");

        client.channels.cache
            .get(process.env.GENERAL_CHANNEL_ID)
            .send({ content: ` `, files: [attachment] });
    }

    member.roles.add("726770857531408404");
});
