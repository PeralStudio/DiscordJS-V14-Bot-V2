module.exports = {
    name: "bigtext",
    description: "Texto en BigText.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a convertir en bigtext.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const args = interaction.options.get("texto").value;

        // BigText('Palabra') => Llamamos a la función y en los parametros colocamos el texto (Para convertirlo en "Grande")
        BigText(args);

        function BigText(args) {
            // AquÃ­ es donde guardaremos la palabra
            const array = [];
            for (letra of Array.from(args)) {
                // Sacamos letra a letra y vericamos con los if lo siguiente...
                if (/\d/g.test(letra)) {
                    // Si la letra es un numero
                    switch (letra) {
                        case "0":
                            array.push(":zero:");
                            break;
                        case "1":
                            array.push(":one:");
                            break;
                        case "2":
                            array.push(":two:");
                            break;
                        case "3":
                            array.push(":three:");
                            break;
                        case "4":
                            array.push(":four:");
                            break;
                        case "5":
                            array.push(":five:");
                            break;
                        case "6":
                            array.push(":six:");
                            break;
                        case "7":
                            array.push(":seven:");
                            break;
                        case "8":
                            array.push(":eight:");
                            break;
                        case "9":
                            array.push(":nine:");
                            break;
                    }
                } else if (/[^a-z]/gi.test(letra)) {
                    // Si no es una letra ni numero
                    // lo pusheamos tal cual esta
                    array.push(letra);
                } else {
                    // Si no es un numero o otro caracter
                    // pusheamos el emoji de la letra
                    array.push(`:regional_indicator_${letra.toLowerCase()}:`);
                    // Si la letra esta en mayuscula la convertiremos a minuscula con toLowerCase()
                }
            }
            // Borramos el mensaje original
            // interaction.message.delete();
            // Unimos el array y lo separamos
            return interaction.reply(array.join(" "));
        }
    },
};
