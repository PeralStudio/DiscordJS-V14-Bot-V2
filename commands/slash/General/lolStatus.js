const { EmbedBuilder, WebhookClient } = require("discord.js");
const axios = require("axios");
const logger = require("../../../utils/logger");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "lol-status",
    description: "Muestra el estado del servicio de lol",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const options = {
            method: "GET",
            url: "https://euw1.api.riotgames.com/lol/status/v4/platform-data",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
                "Accept-Language": "es-ES,es;q=0.8",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                Origin: "https://developer.riotgames.com",
                "X-Riot-Token": process.env.LOL_KEY
            }
        };

        try {
            await interaction.channel.sendTyping();
            await interaction.deferReply({ content: "Cargando...", ephemeral: true });
            const response = await axios.request(options);

            const maintenances = response.data.maintenances[0]?.updates;
            const nextMaintenance = maintenances[0]?.translations;
            const spanishNextMaintenance = maintenances[0]?.translations.find(
                (translation) => translation.locale === "es_ES"
            );

            const platforms = response.data.maintenances[0].platforms.join(", ");
            const firstUpdate = maintenances[0]?.translations;
            const translations = maintenances[1]?.translations;

            if (response.data.maintenances.length < 1 || nextMaintenance.length < 1) {
                const embed = new EmbedBuilder()
                    .setTitle("Estado del servicio de League of Legends")
                    .setDescription("El servicio de lol está operativo")
                    .setThumbnail("https://peralstudio.com/images/lol2-logo.png")
                    .setColor("#730213")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                await interaction.editReply({ embeds: [embed] });

                return;
            }

            if (nextMaintenance) {
                const maintenanceEmbed = new EmbedBuilder()
                    .setTitle("Estado del servicio de League of Legends")
                    .setDescription(spanishNextMaintenance.content)
                    .setThumbnail("https://peralstudio.com/images/lol2-logo.png")
                    .addFields(
                        { name: "\u200B", value: " " },
                        {
                            name: "Plataformas Afectadas",
                            value: platforms
                        },
                        { name: "\u200B", value: " " }
                    )
                    .setColor("#730213")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                return await interaction.editReply({ embeds: [maintenanceEmbed] });
            }

            if (!firstUpdate) {
                const embed = new EmbedBuilder()
                    .setTitle("Estado del servicio de League of Legends")
                    .setDescription("El servicio de lol está operativo")
                    .setThumbnail("https://peralstudio.com/images/lol2-logo.png")
                    .setColor("#730213")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                return await interaction.editReply({ embeds: [embed] });
            }
            if (!translations) {
                const embed = new EmbedBuilder()
                    .setTitle("Estado del servicio de League of Legends")
                    .setDescription("El servicio de lol está operativo")
                    .setThumbnail("https://peralstudio.com/images/lol2-logo.png")
                    .setColor("#730213")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                return await interaction.editReply({ embeds: [embed] });
            }

            const spanishTranslation = translations.find(
                (translation) => translation.locale === "es_ES"
            );

            const spanishTranslation2 = firstUpdate.find(
                (translation) => translation.locale === "es_ES"
            );

            let maintenanceEmbed = new EmbedBuilder()
                .setTitle("Estado del servicio de League of Legends")
                .setDescription(spanishTranslation.content)
                .setThumbnail("https://peralstudio.com/images/lol2-logo.png")
                .addFields(
                    { name: "\u200B", value: " " },
                    {
                        name: "Plataformas Afectadas",
                        value: platforms
                    },
                    { name: "\u200B", value: " " }
                )
                .setColor("#730213")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            let maintenanceEmbed2 = new EmbedBuilder()
                .setTitle("Mensajes Anteriores")
                .setDescription(spanishTranslation2.content)
                .setThumbnail("https://peralstudio.com/images/lol2-logo.png")
                .addFields(
                    { name: "\u200B", value: " " },
                    {
                        name: "Plataformas Afectadas",
                        value: platforms
                    },
                    { name: "\u200B", value: " " }
                )
                .setColor("#730213")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            if (spanishTranslation && !spanishTranslation2) {
                await interaction.editReply({ embeds: [maintenanceEmbed] });
            } else if (spanishTranslation && spanishTranslation2) {
                await interaction.editReply({ embeds: [maintenanceEmbed, maintenanceEmbed2] });
            } else {
                logger.error(
                    `Error comando ${interaction.commandName}: No se encontró la traducción en español.`
                );
                webhook.send({
                    content: `No se encontró la traducción en español.`
                });
            }
        } catch (err) {
            logger.error(`Error comando ${interaction.commandName}: ${err}`);
            webhook.send({
                content: `Error comando: **${interaction.commandName}**\`\`\`${err}\`\`\``
            });
        }
    }
};
