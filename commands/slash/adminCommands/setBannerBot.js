const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const logger = require("../../../utils/logger");
require("dotenv").config();

module.exports = {
    name: "bot-banner",
    description: "Cambiar el banner del bot.",
    type: 1,
    options: [
        {
            type: 11,
            name: "imagen",
            description: "Adjuntar imagen.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder().setDescription("⛔ No tienes permisos.").setColor("#EA3939")
                ]
            });
            return;
        }

        const bannerAttch = interaction.options.get("imagen")?.attachment?.attachment;

        try {
            // Convert image to base64
            const response = await fetch.default(bannerAttch);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            const imageData = `data:${bannerAttch.contentType};base64,${base64}`;

            // Update banner
            const patchResponse = await fetch.default("https://discord.com/api/v10/users/@me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${client.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ banner: imageData })
            });

            if (!patchResponse.ok)
                throw new Error(
                    `<a:siren:1218595505106452610> No se ha podido actualizar el banner: ${patchResponse.statusText}`
                );

            const embed = new EmbedBuilder()
                .setTitle(`✅  Banner cambiado correctamente.`)
                .setImage(bannerAttch)
                .setColor("#D4B053");

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (e) {
            logger.error(`Error: ${e}`);
            await interaction.reply({
                content: `<a:error:1218596001506529360> Error al actualizar el banner: ${error.message}`
            });
        }
    }
};
