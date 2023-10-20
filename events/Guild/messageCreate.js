const { EmbedBuilder, PermissionsBitField, WebhookClient } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const client = require("../../index");
const config = require("../../config/config.js");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_BOT_DMS_CHANNEL
});

module.exports = {
    name: "messageCreate"
};

client.on("messageCreate", async (message) => {
    if (!message.guild) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTitle(`Mensaje recibido de ${message.author.username}`)
            .setDescription(`${message.content}\n`)
            .setThumbnail(message.author.displayAvatarURL())
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

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

    if (message.channel.id === process.env.CHAT_GPT_CHANNEL) {
        if (message.author.bot) return;
        let conversationLog = [{ role: "system", content: "You are a friendly chatbot." }];

        try {
            await message.channel.sendTyping();

            let prevMessages = await message.channel.messages.fetch({ limit: 15 });
            prevMessages.reverse();

            prevMessages.forEach((msg) => {
                if (message.content.startsWith("!")) return;
                if (msg.author.id !== client.user.id && message.author.bot) return;
                if (msg.author.id !== message.author.id) return;

                conversationLog.push({
                    role: "user",
                    content: msg.content
                });
            });

            const result = await openai
                .createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: conversationLog
                    // max_tokens: 256, // limit token usage
                })
                .catch((error) => {
                    console.log(`OPENAI ERR: ${error}`);
                });

            message.reply(result.data.choices[0].message);
        } catch (error) {
            console.log(`ERR: ${error}`);
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
