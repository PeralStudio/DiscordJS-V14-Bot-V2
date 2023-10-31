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
                name: interaction.user.tag,

                iconURL: interaction.user.displayAvatarURL()
            })
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(
                `Para borrar un **Recordatorio**, usa el comando\n \`/borrar-recordatorios\``
            )
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        for (const task of userTasks) {
            let numTask = userTasks.indexOf(task) + 1;
            embedTasks.addFields({
                name: `📝 ${numTask}. ${task.Task}`,
                value: `📆 ${task.Date}\n🆔 ${task.ID}`,
                inline: true
            });
        }
        interaction.reply({ embeds: [embedTasks], ephemeral: true });
    }
};
