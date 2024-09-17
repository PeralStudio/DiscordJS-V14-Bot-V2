const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const prism = require("prism-media");
const fs = require("fs");
const path = require("path");
const logger = require("../../../utils/logger");
require("dotenv").config();

module.exports = {
    name: "suno-crear",
    description: "Genera una canción a partir de la letra y estilo proporcionado.",
    type: 1,
    options: [
        {
            type: 3,
            name: "letra",
            description: "Letra de la canción",
            required: true
        },
        {
            type: 3,
            name: "estilo",
            description: "Estilo musical (ej. reggae, rock, pop)",
            required: true
        },
        {
            type: 3,
            name: "titulo",
            description: "Título de la canción",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        // Verificar permisos
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para generar canciones.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        // Respuesta inicial mientras se genera la canción
        await interaction.reply({
            content: "Tu canción está siendo generada. Por favor espera un momento."
        });

        const lyrics = interaction.options.getString("letra");
        const style = interaction.options.getString("estilo");
        const title = interaction.options.getString("titulo");
        const baseUrl = "https://suno-api-sooty-six.vercel.app";

        try {
            // Petición a la API de Suno para generar la canción
            const response = await axios.post(
                `${baseUrl}/api/custom_generate`,
                {
                    prompt: lyrics,
                    tags: style,
                    title,
                    make_instrumental: "false",
                    wait_audio: true
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status >= 200 && response.status < 300) {
                const songsData = response.data;

                // Array para almacenar las promesas de archivos
                const filePromises = songsData.map(async (songData) => {
                    const streamingUrl = songData.audio_url;

                    // Crear un stream de la respuesta de audio
                    const audioStream = await axios.get(streamingUrl, { responseType: "stream" });

                    // Convertir el audio usando prism-media
                    const audioConverter = new prism.FFmpeg({
                        args: ["-f", "mp3", "-acodec", "libmp3lame"]
                    });

                    // Guardar el archivo convertido
                    const outputPath = path.join(__dirname, `${songData.id}.mp3`);
                    const fileStream = fs.createWriteStream(outputPath);

                    return new Promise((resolve, reject) => {
                        audioStream.data.pipe(audioConverter).pipe(fileStream);

                        fileStream.on("finish", () => {
                            resolve({ filePath: outputPath, title: songData.title });
                        });

                        fileStream.on("error", (err) => {
                            reject(`Error al guardar el archivo de audio ${songData.id}: ${err}`);
                        });
                    });
                });

                // Esperar a que todos los archivos se guarden
                const files = await Promise.all(filePromises);

                // Enviar los archivos de audio como adjuntos en Discord
                await interaction.editReply({
                    content: `Título:\n📜 ${title}\n\nEstilo Musical:\n🎶 ${style}\n\nLetra:\n✍️ ${lyrics}`,
                    files: files.map((file) => ({
                        attachment: file.filePath,
                        name: `${file.title}.mp3`
                    }))
                });

                // Eliminar los archivos después de enviarlos
                files.forEach((file) => fs.unlinkSync(file.filePath));
            }
        } catch (e) {
            logger.error(`Error al generar la canción: ${e}`);
            interaction.editReply({
                content: "Hubo un error al generar la canción. Inténtalo de nuevo más tarde.",
                ephemeral: true
            });
        }
    }
};
