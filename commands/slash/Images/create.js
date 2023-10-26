const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");
require("dotenv").config();

module.exports = {
    name: "crear-imagen",
    description: "crear imagen con Avatar",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Avatar de usuario a crear imagen",
            required: true
        },
        {
            type: 3,
            name: "option",
            description: "Opciones disponibles",
            required: true,
            choices: [
                { name: "💰 Se busca", value: "wanted" },
                { name: "🗑️ Borrar", value: "delete" },
                { name: "😡 Rage", value: "triggered" },
                { name: "🍫 M&M's", value: "mms" },
                { name: "🖌️ Saturación", value: "deepfry" },
                { name: "🥸 Hitler", value: "hitler" },
                { name: "🧱 Preso", value: "jail" }
            ]
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const user = interaction.options.getMember("usuario");
        const option = interaction.options.getString("option");
        const userAvatar = user.displayAvatarURL({
            size: 1024,
            dynamic: false,
            extension: "png"
        });

        switch (option) {
            case "wanted":
                const imgWanted = await new DIG.Wanted().getImage(userAvatar, `€`);
                const attachWanted = new AttachmentBuilder(imgWanted, { name: "wanted.png" });

                const embedWanted = new EmbedBuilder()
                    .setColor("Random")
                    .setImage("attachment://wanted.png")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.reply({ embeds: [embedWanted], files: [attachWanted] });
                break;
            case "delete":
                const imgDelete = await new DIG.Delete().getImage(userAvatar);
                const attachDelete = new AttachmentBuilder(imgDelete, { name: "delete.png" });

                const embedDelete = new EmbedBuilder()
                    .setColor("Random")
                    .setImage("attachment://delete.png")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.reply({ embeds: [embedDelete], files: [attachDelete] });
                break;
            case "triggered":
                const imgTriggered = await new DIG.Triggered().getImage(userAvatar);
                const attachTriggered = new AttachmentBuilder(imgTriggered, {
                    name: "triggered.gif"
                });
                const embedTriggered = new EmbedBuilder()
                    .setColor("Random")
                    .setImage("attachment://triggered.gif")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.reply({ embeds: [embedTriggered], files: [attachTriggered] });
                break;
            case "mms":
                const imgMms = await new DIG.Mms().getImage(userAvatar);
                const attachMms = new AttachmentBuilder(imgMms, { name: "mms.png" });

                const embedMms = new EmbedBuilder()
                    .setColor("Random")
                    .setImage("attachment://mms.png")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.reply({ embeds: [embedMms], files: [attachMms] });
                break;
            case "deepfry":
                const imgDeepfry = await new DIG.Deepfry().getImage(userAvatar);
                const attachDeepfry = new AttachmentBuilder(imgDeepfry, {
                    name: "deepfry.png"
                });

                const embedDeepfry = new EmbedBuilder()
                    .setColor("Random")
                    .setImage("attachment://deepfry.png")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.reply({ embeds: [embedDeepfry], files: [attachDeepfry] });
                break;
            case "hitler":
                const imgHitler = await new DIG.Hitler().getImage(userAvatar);
                const attachHitler = new AttachmentBuilder(imgHitler, {
                    name: "hitler.png"
                });

                const embedHitler = new EmbedBuilder()
                    .setColor("Random")
                    .setImage("attachment://hitler.png")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.reply({ embeds: [embedHitler], files: [attachHitler] });
                break;
            case "jail":
                const imgJail = await new DIG.Jail().getImage(userAvatar);
                const attachJail = new AttachmentBuilder(imgJail, {
                    name: "jail.png"
                });

                const embedJail = new EmbedBuilder()
                    .setColor("Random")
                    .setImage("attachment://jail.png")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.reply({ embeds: [embedJail], files: [attachJail] });
                break;
        }
    }
};
