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
    run: async (client, interaction, config) => {
        if (
            interaction.user.id !== process.env.ID_OWNER &&
            interaction.user.id !== "254135921144758273" &&
            interaction.user.id !== "298585122519908364" &&
            interaction.user.id !== "179686774895935489"
        ) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder().setDescription("⛔ No tienes permisos.").setColor("#EA3939")
                ]
            });
            return;
        }
        const code = interaction.options.getString("codigo");
        const embed = new EmbedBuilder();
        try {
            const evaled = eval(code);
            embed
                .setTitle("Eval")
                .setDescription(
                    `**Código:**\n\`\`\`js\n${code}\`\`\`\n**Resultado:**\n\`\`\`js\n${evaled}\`\`\``
                )
                .setColor("#AA70F8");
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            embed
                .setTitle("Eval")
                .setDescription(
                    `**Código:**\n\`\`\`js\n${code}\`\`\`\n**Error:**\n\`\`\`js\n${err}\`\`\``
                )
                .setColor("#AA70F8");
            interaction.reply({ embeds: [embed] });
        }
        return;
    }
};
