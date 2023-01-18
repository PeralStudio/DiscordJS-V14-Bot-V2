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
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const text = interaction.options.get("texto").value;
        translate(
            {
                text: text,
                source: "es", // Este es la fuente, es decir el idioma que queremos pasar a el idioma puesto en target, ya saben con codigo i18n.
                target: "en", // El idioma en i18n al que queremos traducir
            },
            function (result) {
                const embedTraductor = new EmbedBuilder() //Creamos el embed con el nombre encuesta

                    // .setTitle(`${question} \n`)
                    .setThumbnail("https://cdn-icons-png.flaticon.com/512/281/281776.png")
                    .addFields(
                        {
                            name: "Original",
                            value: result.sentences[0].orig,
                        },
                        {
                            name: "Traducción",
                            value: result.sentences[0].trans,
                        }
                    )
                    // .setFooter(`Encuesta realizada por: ${message.author.tag}`)
                    .setColor("#C28F2C");

                interaction.reply({ embeds: [embedTraductor] });
            }
        );
    },
};
