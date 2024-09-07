const { EmbedBuilder, WebhookClient } = require("discord.js");
const reminderSchema = require("../../../schemas/reminderSchema");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "borrar-recordatorio",
    description: "Borrar un recordatorio",
    type: 1,
    options: [
        {
            type: 3,
            name: "id",
            description: "ID del recordatorio",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const id = interaction.options.getString(`id`);

        const userTasksToDelete = await reminderSchema.find({
            UserID: interaction.user.id,
            ID: id
        });
        if (userTasksToDelete.length === 0) {
            return interaction.reply({
                content: `❌ No tienes recordatorios con ese ID ❌`,
                ephemeral: true
            });
        }
        try {
            //!todo Eliminar el cron job creado en reminder.js al crear reminder
            // const tasks = cron.getTasks();

            // tasks.forEach((task) => {
            //     const taskData = task.data;
            //     console.log(task);
            //     const taskUserID = taskData.UserID;
            //     const taskID = taskData.ID;
            //     if ( taskID === id) {
            //         task.stop();
            //     }
            // });
            await reminderSchema.deleteOne({ UserID: interaction.user.id, ID: id });
        } catch (error) {
            webhook.send({
                content: `Error comando: **${interaction.commandName}**\`\`\`${err}\`\`\``
            });
        } finally {
            const embed = new EmbedBuilder()
                .setColor(`Orange`)
                .setTitle(`✅ Recordatorio Borrado Correctamente`)
                .setDescription(
                    `Si quieres ver tus recordatorios, usa el comando \`/ver-recordatorios\``
                )
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
