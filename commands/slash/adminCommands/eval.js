const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "eval",
    description: "Evaluar código JavaScript.",
    type: 1,
    options: [
        {
            type: 3,
            name: "codigo",
            description: "Código JS a evaluar.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction) => {
        // Verificar permisos
        const authorizedUsers = [
            process.env.ID_OWNER,
            "254135921144758273",
            "298585122519908364",
            "179686774895935489"
        ];

        if (!authorizedUsers.includes(interaction.user.id)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setDescription("⛔ No tienes permisos para usar este comando.")
                .setColor("#EA3939");
            return interaction.reply({ ephemeral: true, embeds: [noPermissionEmbed] });
        }

        // Obtener y evaluar código
        const code = interaction.options.getString("codigo");
        const embed = new EmbedBuilder().setTitle("Evaluación de Código").setColor("#AA70F8");

        try {
            // Evaluar código y manejar posibles objetos complejos
            let evaled = eval(code);
            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled, { depth: 1 });
            }

            // Enviar resultados en embed
            embed.setDescription(
                `**Código:**\n\`\`\`js\n${code}\`\`\`\n**Resultado:**\n\`\`\`js\n${evaled}\`\`\``
            );
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            // Manejar errores
            embed.setDescription(
                `**Código:**\n\`\`\`js\n${code}\`\`\`\n**Error:**\n\`\`\`js\n${err}\`\`\``
            );
            interaction.reply({ embeds: [embed] });
        }
    }
};
