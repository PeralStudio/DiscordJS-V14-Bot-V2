const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const logger = require("../../../utils/logger");
require("dotenv").config();

const configuracion = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuracion);

module.exports = {
    name: "imagen-ia",
    description: "Crea imagenes con OpenAI",
    type: 1,
    options: [
        {
            type: 3,
            name: "promt",
            description: "Texto a convertir en imagen ",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const prompt = interaction.options.getString("promt");
        await interaction.deferReply();

        const options = {
            method: "POST",
            url: "https://open-ai21.p.rapidapi.com/texttoimage2",
            headers: {
                "x-rapidapi-key": "64a9059723msh7ebb4bec0560d4dp1e6b4cjsn7e281520106e",
                "x-rapidapi-host": "open-ai21.p.rapidapi.com",
                "Content-Type": "application/json"
            },
            data: { text: prompt }
        };

        try {
            const response = await axios.request(options);

            const embed = new EmbedBuilder()
                .setTitle(`OpenIA`)
                .setAuthor({
                    name: "imagen IA",
                    iconURL:
                        "https://media.discordapp.net/attachments/1095798616561569916/1095960617380225024/1_bf37-lAuwi6_Wx5-e5EJ1Q.jpg?width=473&height=473"
                })
                .setColor(`#00A67E`)
                .setTimestamp()
                .setFooter({
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                    text: interaction.user.tag
                })
                .setThumbnail(client.user.displayAvatarURL())
                .setImage(`${response.data.generated_image}`)
                .setDescription(`Promt: \`\`\`${prompt}\`\`\``);

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            logger.error(e);
            return await interaction.editReply({
                content: `solicitud fallida con el estado del codigo **${e}**`,
                ephemeral: true
            });
        }

        try {
            const res = await openai.createImage({
                prompt,
                n: 1,
                size: "1024x1024"
            });
        } catch (e) {}
    }
};
