const { EmbedBuilder } = require("discord.js");
const reminderSchema = require("../schemas/reminderSchema");
const cron = require("node-cron");
require("dotenv").config();

const reminders = async (client) => {
    const remindersBD = await reminderSchema.find({}).exec();

    if (remindersBD.length < 1) return;

    for (let i = 0; i < remindersBD.length; i++) {
        const reminder = remindersBD[i];

        cron.schedule(
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
                            name: ` `,
                            value: `📝 Tarea: **${reminder.Task}**`
                        },
                        { name: "\u200B", value: " " }
                    )
                    .setTimestamp();

                await client.users.fetch(reminder.UserID).then((user) => {
                    user.send({ embeds: [remindEmbed] });
                });

                await reminderSchema.findOneAndDelete({
                    Guild: reminder.Guild,
                    UserID: reminder.UserID,
                    Task: reminder.Task,
                    Cron: reminder.Cron
                });
                job.stop();
            },
            {
                timezone: "Europe/Madrid"
            }
        );
    }
};

module.exports = reminders;
