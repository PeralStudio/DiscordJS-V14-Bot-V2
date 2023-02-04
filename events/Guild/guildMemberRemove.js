const { AttachmentBuilder } = require("discord.js");
const client = require("../../index");
const { Leaver } = require("canvacord");

module.exports = {
    name: "guildMemberRemove",
};

client.on("guildMemberRemove", async (member) => {
    if (member.guild.id === process.env.GUILD_ID) {
        const imagesArray = [
            "https://i.postimg.cc/C5kLJdsD/istockphoto-1164222265-612x612.png",
            "https://i.postimg.cc/pXByqnkR/hd-background.png",
            "https://i.postimg.cc/K8gwmtVy/arcane-jinx-league-of-legends-league-of-legends-hd-wallpaper-preview.png",
            "https://i.postimg.cc/kMY74FjV/1194219.png",
        ];

        const random = Math.floor(Math.random() * imagesArray.length);

        const leaver = new Leaver()
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setGuildName(member.guild.name)
            .setAvatar(
                member.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })
            )
            .setMemberCount(member.guild.memberCount)
            .setColor("border", "#7a42b2")
            .setColor("background", "#2d1a3f")
            .setColor("username-box", "#ff4a4a")
            .setColor("discriminator-box", "#ff4a4a")
            .setColor("title", "#ffffff")
            .setBackground(imagesArray[random]);

        leaver.build().then((data) => {
            client.channels.cache.get(process.env.GENERAL_CHANNEL_ID).send({
                content: ` `,
                files: [new AttachmentBuilder(data, { name: "Bienvenida.png" })],
            });
        });
    }
});
