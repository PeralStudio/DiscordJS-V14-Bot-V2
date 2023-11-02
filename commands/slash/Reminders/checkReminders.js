const { EmbedBuilder } = require("discord.js");
const reminderSchema = require("../../../schemas/reminderSchema");
require("dotenv").config();

module.exports = {
    name: "ver-recordatorios",
    description: "Ver mis recordatorios",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const userTasks = await reminderSchema.find({ UserID: interaction.user.id });

        if (userTasks.length === 0)
            return interaction.reply({
                content: "❌ No tienes recordatorios creados",
                ephemeral: true
            });

        let embedTasks = new EmbedBuilder()
            .setColor(0x00ffff)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(
                `:pencil2: Para **Editar un Recordatorio**, usa el comando\n \`/editar-recordatorio\`\n\n:wastebasket: Para **borrar un Recordatorio**, usa el comando\n \`/borrar-recordatorio\``
            )
            .addFields({ name: "\u200B", value: " " })
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        for (const task of userTasks) {
            const date = task.Date.split(" ")[0].split(",")[0];
            const hour = task.Date.split(" ")[1];

            embedTasks.addFields(
                {
                    name: `📝 ${task.Task}`,
                    value: `📆 ${date}\n⏱️ ${hour}\n🆔 ${task.ID}`,
                    inline: true
                },
                { name: "\u200B", value: " " }
            );
        }
        interaction.reply({ embeds: [embedTasks], ephemeral: true });
    }
};
