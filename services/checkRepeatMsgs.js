const logger = require("../utils/logger");

const checkRepeatMsgs = async (client, channelID) => {
    try {
        const channel = await client.channels.fetch(channelID);
        const messages = await channel.messages.fetch({ limit: 16 });

        const urlSet = new Set(); // Almacena URLs únicas

        const extractUrl = (message) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g; // Expresión regular para encontrar URLs
            const urls = message.content.match(urlRegex); // Extrae URLs del mensaje
            return urls ? urls[0] : null; // Retorna la primera URL encontrada o null si no hay URL
        };

        const duplicateMessages = messages.filter((message) => {
            const url = extractUrl(message);
            if (url && urlSet.has(url)) {
                return true; // Mensaje duplicado (URL ya existe)
            } else if (url) {
                urlSet.add(url); // Agregar URL al set
                return false; // Mensaje único
            }
            return false; // Si no tiene URL, no lo consideramos duplicado
        });

        if (duplicateMessages.size > 0) {
            duplicateMessages.forEach(async (message) => {
                if (!message.deleted) {
                    try {
                        await message.delete({
                            reason: "Deleting duplicate messages based on URL"
                        });
                        logger.info(`Mensaje eliminado: ${message.content}`);
                    } catch (e) {
                        logger.error(`Error al eliminar el mensaje: ${message.id}\nError: ${e}`);
                    }
                }
            });
        }
    } catch (e) {
        logger.error(
            `Error al verificar mensajes duplicados en el canal: ${channelID}\nError: ${e}`
        );
    }
};

module.exports = checkRepeatMsgs;
