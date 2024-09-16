require("dotenv").config();
const triviaQuestions = require("../../../utils/triviaQuestions.js");

module.exports = {
    name: "trivial",
    description: "Jugar al Trivial",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const item = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
        const filter = (response) =>
            item.answers.some((answer) => answer.toLowerCase() === response.content.toLowerCase());

        try {
            // Enviar la pregunta y esperar la respuesta
            await interaction.reply({ content: item.question, fetchReply: true });

            const collected = await interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ["time"]
            });

            await interaction.followUp(
                `${
                    collected.first().author
                } obtuvo la respuesta correcta! Respuesta(s): ${item.answers.join(", ")}!`
            );
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code === 10062) {
                console.error("La interacción ha expirado o ya no es válida.");
            } else {
                console.error("Error al manejar la interacción:", error);
            }

            await interaction.followUp(
                `Parece que nadie obtuvo la respuesta correcta.\nLa respuesta correcta era: ${item.answers.join(
                    ", "
                )}`
            );
        }
    }
};
