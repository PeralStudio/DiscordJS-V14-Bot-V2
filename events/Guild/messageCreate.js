const { EmbedBuilder, WebhookClient } = require("discord.js");
const client = require("../../index");
const axios = require("axios");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_BOT_DMS_CHANNEL
});

module.exports = {
    name: "messageCreate"
};

client.on("messageCreate", async (message) => {
    // Send md's bot msg receive to the channel BOT_DMS_CHANNEL
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

    // Interaction chatGPT in CHAT_GPT_CHANNEL channel
    if (message.channel.id === process.env.CHAT_GPT_CHANNEL) {
        if (message.author.bot) return;

        const options = {
            method: "GET",
            url: "https://google-bard1.p.rapidapi.com/",
            headers: {
                psid: process.env.BARD_PSID,
                text: message.content,
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "google-bard1.p.rapidapi.com"
            }
        };

        try {
            await message.channel.sendTyping();
            const response = await axios.request(options);

            message.reply(response.data.response);
        } catch (error) {
            console.error(error);
        }
    }
});
