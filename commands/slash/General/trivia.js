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
        const filter = (response) => {
            return item.answers.some(
                (answer) => answer.toLowerCase() === response.content.toLowerCase()
            );
        };

        await interaction.reply({ content: item.question, fetchReply: true }).then(async () => {
            await interaction.channel
                .awaitMessages({
                    filter,
                    max: 1,
                    time: 30000,
                    errors: ["time"]
                })
                .then(async (collected) => {
                    await interaction.followUp(
                        `${collected.first().author} obtuvo la respuesta correcta! !${
                            item.answers
                        }!`
                    );
                })
                .catch(async (collected) => {
                    await interaction.followUp(
                        `Parece que nadie obtuvo la respuesta correcta.\nLa respuesta correcta era: ${item.answers}`
                    );
                });
        });
    }
};
