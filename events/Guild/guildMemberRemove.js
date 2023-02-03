const { AttachmentBuilder } = require("discord.js");
const client = require("../../index");
const Canvas = require("discord-canvas");

module.exports = {
    name: "guildMemberRemove",
};

client.on("guildMemberRemove", async (member) => {
    if (member.guild.id === process.env.GUILD_ID) {
        const image = await new Canvas.Goodbye()
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
            .setBackground("https://i.postimg.cc/4ddq5MsT/909912.png")
            .toAttachment();

        const attachment = new AttachmentBuilder(image.toBuffer(), "goodbye-image.png");

        client.channels.cache
            .get(process.env.GENERAL_CHANNEL_ID)
            .send({ content: ` `, files: [attachment] });
    }
});
