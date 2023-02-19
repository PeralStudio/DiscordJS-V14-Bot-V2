const { EmbedBuilder } = require("discord.js");
const translate = require("node-google-translate-skidz");
require("dotenv").config();

module.exports = {
    name: "traducir",
    description: "Traducir un texto.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a traducir.",
            required: true,
        },
        {
            type: 3,
            name: "entrada",
            description: "Idioma de entrada.",
            required: true,
            choices: [
                { name: "🇪🇸 -Español", value: "es" },
                { name: "🇺🇸 -Ingles", value: "en" },
                { name: "🇩🇪 -Aleman", value: "de" },
                { name: "🇫🇷 -Frances", value: "fr" },
                { name: "🇵🇹 -Portugal", value: "pt" },
            ],
        },
        {
            type: 3,
            name: "salida",
            description: "Idioma de salida.",
            required: true,
            choices: [
                { name: "🇪🇸 -Español", value: "es" },
                { name: "🇺🇸 -Ingles", value: "en" },
                { name: "🇩🇪 -Aleman", value: "de" },
                { name: "🇫🇷 -Frances", value: "fr" },
                { name: "🇵🇹 -Portugues", value: "pt" },
            ],
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const text = interaction.options.get("texto").value;
        const translateInput = interaction.options.get("entrada").value;
        const translateOutput = interaction.options.get("salida").value;

        if (translateInput === translateOutput) {
            const embedError = new EmbedBuilder()
                .setTitle("❌ Debes selecionar diferentes idiomas.")
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor("#C28F2C");

            return interaction.reply({ embeds: [embedError] });
        }

        translate(
            {
                text: text,
                source: translateInput,
                target: translateOutput,
            },
            function (result) {
                const embedTraductor = new EmbedBuilder()
                    .setThumbnail("https://cdn-icons-png.flaticon.com/512/281/281776.png")
                    .setDescription(
                        `**Original:**\n\`\`\`\n${result.sentences[0].orig}\`\`\`\n**Traducción:**\n\`\`\`\n${result.sentences[0].trans}\`\`\``
                    )
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setTimestamp()
                    .setColor("#C28F2C");

                interaction.reply({ embeds: [embedTraductor] });
            }
        );
    },
};
