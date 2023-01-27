require("dotenv").config();
const axios = require("axios");

module.exports = {
    name: "chatgpt",
    description: "Chat GPT-3",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a enviar a chat GPT-3",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const texto = interaction.options.get("texto").value;

        const options = {
            method: "POST",
            url: "https://you-chat-gpt.p.rapidapi.com/",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "you-chat-gpt.p.rapidapi.com",
            },
            data: { question: texto, max_response_time: 15 },
        };

        const getData = async () => {
            let response = await axios.request(options);
            return response.data.answer;
        };

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });
        const result = await getData();
        await interaction.editReply({ content: result, ephemeral: true });
    },
};
