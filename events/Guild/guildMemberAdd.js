const { AttachmentBuilder } = require("discord.js");
const client = require("../../index");
const { Welcomer } = require("canvacord");

module.exports = {
    name: "guildMemberAdd",
};

client.on("guildMemberAdd", async (member) => {
    console.log("member: ", member.user.username);
    if (member.guild.id === process.env.GUILD_ID) {
        const imagesArray = [
            "https://i.postimg.cc/C5kLJdsD/istockphoto-1164222265-612x612.png",
            "https://i.postimg.cc/pXByqnkR/hd-background.png",
            "https://i.postimg.cc/K8gwmtVy/arcane-jinx-league-of-legends-league-of-legends-hd-wallpaper-preview.png",
            "https://i.postimg.cc/kMY74FjV/1194219.png",
        ];

        const random = await Math.floor(Math.random() * imagesArray.length);

        const welcomer = await new Welcomer()
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
            .setColor("title", "#ffffff")
            .setBackground(imagesArray[random]);

        welcomer.build().then((data) => {
            client.channels.cache.get(process.env.GENERAL_CHANNEL_ID).send({
                content: ` `,
                files: [new AttachmentBuilder(data, { name: "Bienvenida.png" })],
            });
        });
    }

    member.roles.add("726770857531408404");
});
