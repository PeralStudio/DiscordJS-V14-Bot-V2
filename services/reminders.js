const { EmbedBuilder } = require("discord.js");
const reminderSchema = require("../schemas/reminderSchema");
const cron = require("node-cron");
require("dotenv").config();

const reminders = async (client) => {
    const remindersBD = await reminderSchema.find({}).exec();

    if (remindersBD.length < 1) return;

    for (let i = 0; i < remindersBD.length; i++) {
        const reminder = remindersBD[i];

        // Definimos el cron job y lo asignamos a una variable
        const job = cron.schedule(
            reminder.Cron,
            async () => {
                const remindEmbed = new EmbedBuilder()
                    .setColor(`Orange`)
                    .setTitle(`✅ Recordatorio`)
                    .addFields(
                        { name: "\u200B", value: " " },
                        {
                            name: `Tu temporizador de recordatorio ha terminado`,
                            value: ` `
                        },
                        { name: "\u200B", value: " " },
                        {
                            name: `📝 Tarea: **${reminder.Task}**`
                        },
                        { name: "\u200B", value: " " }
                    )
                    .setTimestamp();

                await client.users.fetch(reminder.UserID).then((user) => {
                    user.send({ embeds: [remindEmbed] });
                });

                // Eliminar el recordatorio de la base de datos
                await reminderSchema.findOneAndDelete({
                    Guild: reminder.Guild,
                    UserID: reminder.UserID,
                    Task: reminder.Task,
                    Cron: reminder.Cron
                });

                // Detener el cron job
                job.stop();
            },
            {
                timezone: "Europe/Madrid"
            }
        );
    }
};

module.exports = reminders;
