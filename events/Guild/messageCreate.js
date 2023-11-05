const { EmbedBuilder, PermissionsBitField, WebhookClient } = require("discord.js");
const axios = require("axios");
const client = require("../../index");
const config = require("../../config/config.js");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_BOT_DMS_CHANNEL
});

const errorWebhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "messageCreate"
};

client.on("messageCreate", async (message) => {
    // Send md's bot msg receive to the channel BOT_DMS_CHANNEL
    if (!message.guild) {
        let file;
        if (message.author.bot) return;
        if (message.attachments.size > 0) {
            file = message.attachments.first().url;
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTitle(`Mensaje recibido de ${message.author.username}`)
            .setDescription(`${message.content}\n`)
            .setThumbnail(message.author.displayAvatarURL())
            .setImage(file && file)
            .setColor("Random")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        webhook.send({
            embeds: [embed]
        });
    }

    // Interaction chatGPT in BARD_GOOGLE_CHANNEL channel
    if (message.channel.id === process.env.BARD_GOOGLE_CHANNEL) {
        if (message.author.bot) return;

        const options = {
            method: "GET",
            url: "https://google-bard1.p.rapidapi.com/",
            headers: {
                psid: process.env.BARD_PSID,
                text: message.content,
                model: "gchat",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "google-bard1.p.rapidapi.com"
            }
        };

        try {
            await message.channel.sendTyping();
            const response = await axios.request(options);

            message.reply(response.data.response);
        } catch (error) {
            message.reply(
                `Ha ocurrido un error, por favor intentalo de nuevo mas tarde.\n\nError: ${error.response.data.messages}`
            );
            errorWebhook.send({
                content: `Error en el canal **<#${message.channel.id}>**\n\nError: ${error.response.data.messages}`
            });
        }
    }

    if (message.channel.type !== 0) return;
    if (message.author.bot) return;

    const prefix = config.Prefix || "/";

    if (!message.content.startsWith(config.Prefix)) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length == 0) return;

    let command = client.prefix_commands.get(cmd);

    if (!command) return;

    if (command) {
        if (command.permissions) {
            if (
                !message.member.permissions.has(
                    PermissionsBitField.resolve(command.permissions || [])
                )
            )
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `🚫 Unfortunately, you are not authorized to use this command.`
                            )
                            .setColor("Red")
                    ]
                });
        }

        if ((command.owner, command.owner == true)) {
            if (config.Users?.OWNERS) {
                const allowedUsers = []; // New Array.

                config.Users.OWNERS.forEach((user) => {
                    const fetchedUser = message.guild.members.cache.get(user);
                    if (!fetchedUser) return allowedUsers.push("*Unknown User#0000*");
                    allowedUsers.push(`${fetchedUser.user.tag}`);
                });

                if (!config.Users.OWNERS.some((ID) => message.member.id.includes(ID)))
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `🚫 Sorry but only owners can use this command! Allowed users:\n**${allowedUsers.join(
                                        ", "
                                    )}**`
                                )
                                .setColor("Red")
                        ]
                    });
            }
        }

        try {
            command.run(client, message, args, prefix, config);
        } catch (error) {
            console.error(error);
        }
    }
});
