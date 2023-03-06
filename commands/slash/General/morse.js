const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "morse",
    description: "Convertir texto a morse.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a convertir en morse.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        let alpha = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        let morse =
            "/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----".split(
                ","
            );

        let textToConvert = interaction.options.get("texto").value.toUpperCase();

        if (textToConvert.startsWith(".") || textToConvert.startsWith("-")) {
            //Separar el texto morse en array
            textToConvert = textToConvert.split(" ");
            //Longitud
            let length = textToConvert.length;
            //Convertir a texto normal usando un loop
            for (let i = 0; i < length; i++) {
                textToConvert[i] = alpha[morse.indexOf(textToConvert[i])];
            }
            //Volver a unir
            textToConvert = textToConvert.join("");
        } else {
            //Lo mismo. Separar
            textToConvert = textToConvert.split("");
            let length = textToConvert.length;
            //Convertir a morse
            for (let i = 0; i < length; i++) {
                textToConvert[i] = morse[alpha.indexOf(textToConvert[i])];
            }
            textToConvert = textToConvert.join(" ");
        }

        interaction.reply({
            // tts: true, //Habilitar que el bot diga el mensaje
            content: "```" + textToConvert + "```"
        });
    }
};
