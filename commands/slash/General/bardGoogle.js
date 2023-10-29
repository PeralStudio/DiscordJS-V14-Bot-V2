const { WebhookClient } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "bard-google",
    description: "Bard Google",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Consulta a Bard Google",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const prompt = interaction.options.get("texto").value;

        const getData = async () => {
            const options = {
                method: "GET",
                url: "https://google-bard1.p.rapidapi.com/",
                headers: {
                    psid: process.env.BARD_PSID,
                    text: prompt,
                    model: "gchat",
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "google-bard1.p.rapidapi.com"
                }
            };

            try {
                await interaction.channel.sendTyping();
                const response = await axios.request(options);
                return response.data.response;
            } catch (err) {
                webhook.send({
                    content: `Error comando: **${interaction.commandName}**\`\`\`${err}\`\`\``
                });
            }
        };

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });
        const result = await getData();
        await interaction.editReply({ content: result, ephemeral: true });
    }
};
