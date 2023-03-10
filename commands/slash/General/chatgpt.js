const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
// const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");

module.exports = {
    name: "chatgpt",
    description: "Chat GPT-3",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a enviar a chat GPT-3",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const prompt = interaction.options.get("texto").value;

        // const options = {
        //     method: "POST",
        //     url: "https://you-chat-gpt.p.rapidapi.com/",
        //     headers: {
        //         "content-type": "application/json",
        //         "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        //         "X-RapidAPI-Host": "you-chat-gpt.p.rapidapi.com"
        //     },
        //     data: { question: text, max_response_time: 15 }
        // };

        const getData = async () => {
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY
            });
            const openai = new OpenAIApi(configuration);
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            });

            const text = completion.data.choices[0].message.content;
            return text;

            // let response = await axios.request(options);
            // return response.data.answer;
        };

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });
        const result = await getData();

        const embed = new EmbedBuilder()
            // .setThumbnail("https://cdn-icons-png.flaticon.com/512/281/281776.png")
            .setDescription(
                `**Entrada:**\n\`\`\`\n${prompt}\`\`\`\n**Respuesta:**\n\`\`\`\n${result}\`\`\``
            )
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp()
            .setColor("#C28F2C");

        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
};
