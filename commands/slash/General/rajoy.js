const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { createWriteStream, unlink } = require("fs");
const os = require("os"); // Para acceder al directorio temporal
const axios = require("axios");
const https = require("https");
const { join, basename } = require("path");
require("dotenv").config();

// Crear un agente HTTPS que ignore errores de certificado
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = {
    name: "rajoy",
    description: "Frases y audios de Mariano Rajoy",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const url = "https://rajoy-api.netlify.app/frase";

        try {
            const response = await axios.get(url, { httpsAgent: agent });
            interaction.deferReply();

            if (response.status !== 200) {
                throw new Error(
                    `Error al obtener la frase de la API: ${response.status} ${response.statusText}`
                );
            }

            const result = response.data; // Obtenemos el objeto JSON
            const audioUrl = result.audio; // Obtenemos la URL del audio

            // Extraer el nombre del archivo desde la URL
            const audioFileName = basename(audioUrl); // Obtiene solo el nombre del archivo de la URL
            const audioPath = join(os.tmpdir(), audioFileName);

            // Descargar el archivo MP3
            const audioResponse = await fetch(audioUrl);
            if (!audioResponse.ok) {
                throw new Error(
                    `Error al descargar el audio: ${audioResponse.status} ${audioResponse.statusText}`
                );
            }

            // Crear un archivo temporal para el audio
            const fileStream = createWriteStream(audioPath);

            // Pipe para escribir el archivo
            audioResponse.body.pipe(fileStream);

            fileStream.on("finish", async () => {
                // Crear el embed para la respuesta
                const arderEmbed = new EmbedBuilder()
                    .setTitle(`"${result.frase}"`)
                    .setColor("#AA70F8")
                    .setTimestamp()
                    .setThumbnail("https://peralstudio.com/images/Rajoy-Audios-MP3-Frases.png")
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                // Enviar el embed y el archivo de audio
                await interaction.editReply({ files: [audioPath], embeds: [arderEmbed] });

                // Eliminar el archivo después de enviarlo (opcional)
                unlink(audioPath, (err) => {
                    if (err) console.error("Error al eliminar el archivo de audio:", err);
                });
            });

            fileStream.on("error", async (error) => {
                console.error("Error en el fileStream:", error);
                await interaction.reply("Ocurrió un error al intentar enviar el audio.");
            });
        } catch (error) {
            console.error("Error en el comando:", error.message);
            await interaction.reply("Ocurrió un error al obtener la frase o el audio.");
        }
    }
};
