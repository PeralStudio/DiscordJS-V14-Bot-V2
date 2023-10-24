const { EmbedBuilder, WebhookClient } = require("discord.js");
const axios = require("axios");
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

            const maintenances = response.data.maintenances;
            if (maintenances.length < 1) {
                const embed = new EmbedBuilder()
                    .setTitle("Estado del servicio de lol")
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
            for (let i = 0; i < maintenances.length; i++) {
                const firstMaintenance = maintenances[i];
                const platforms = firstMaintenance.platforms.join(", ");
                const updates = firstMaintenance.updates;
                const firstUpdate = updates[i];
                const translations = firstUpdate.translations;

                const spanishTranslation = translations.find(
                    (translation) => translation.locale === "es_ES"
                );

                if (spanishTranslation) {
                    const contentInSpanish = spanishTranslation.content;
                    const maintenanceEmbed = new EmbedBuilder()
                        .setTitle("Estado del servicio de lol")
                        .setDescription(contentInSpanish)
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

                    await interaction.editReply({ embeds: [maintenanceEmbed] });
                } else {
                    webhook.send({
                        content: `No se encontró la traducción en español.`
                    });
                }
            }
        } catch (err) {
            webhook.send({
                content: `Error comando: **${interaction.commandName}**\`\`\`${err}\`\`\``
            });
        }
    }
};
