const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const https = require("https");
require("dotenv").config();

// Crear un agente HTTPS que ignore errores de certificado
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = {
    name: "nsn-ultimo-podcast", // Nombre del comando
    description: "Obtiene el último podcast disponible.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para usar este comando.")
                        .setColor("#EA3939")
                ],
                ephemeral: true
            });
            return;
        }
        try {
            // Realiza la petición a la API
            const response = await axios.get(process.env.NSN_API_URL, { httpsAgent: agent });
            const podcast = response.data; // Asume que la respuesta es un objeto JSON

            // Crea un embed para la respuesta
            const podcastEmbed = new EmbedBuilder()
                .setTitle(podcast.title) // Suponiendo que tienes un título en la respuesta
                .setDescription(podcast.description) // Suponiendo que tienes una descripción en la respuesta
                .setColor("#AA70F8")
                .setURL(podcast.audio) // Asumiendo que hay un campo audioUrl en la respuesta
                .setImage(podcast.image ? podcast.image : null)
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            // Responde con el embed
            await interaction.reply({ embeds: [podcastEmbed] });
        } catch (error) {
            console.error("Error al obtener el podcast:", error);
            await interaction.reply({
                content: "No se pudo obtener el último podcast. Inténtalo más tarde.",
                ephemeral: true
            });
        }
    }
};
