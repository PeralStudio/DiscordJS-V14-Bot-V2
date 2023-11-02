const { EmbedBuilder, WebhookClient } = require("discord.js");
const reminderSchema = require("../../../schemas/reminderSchema");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "editar-recordatorio",
    description: "Editar un recordatorio",
    type: 1,
    options: [
        {
            type: 3,
            name: "id",
            description: "ID del recordatorio",
            required: true
        },
        {
            type: 4,
            name: "dia",
            description: "Día para el recordatorio",
            required: true
        },
        {
            type: 4,
            name: "hora",
            description: "Hora para el recordatorio",
            required: true
        },
        {
            type: 4,
            name: "minutos",
            description: "Minutos para el recordatorio",
            required: true
        },
        {
            type: 3,
            name: "descripción",
            description: "Descripción del recordatorio",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const id = interaction.options.getString(`id`);
        let day = interaction.options.getInteger(`dia`);
        let hour = interaction.options.getInteger(`hora`);
        let minutes = interaction.options.getInteger(`minutos`);
        let desc = interaction.options.getString(`descripción`);
        let today = new Date();
        let month = today.getMonth();

        const userTasksToDelete = await reminderSchema.find({
            ID: id
        });

        if (userTasksToDelete.length === 0) {
            return interaction.reply({
                content: `❌ No tienes recordatorios con ese ID ❌`,
                ephemeral: true
            });
        }

        const userDate = new Date(
            `${today.getFullYear()}-${month + 1}-${day} ${hour}:${minutes}`
        ).toLocaleString("es-ES");

        const todayDate = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

        const userDateD = new Date(userDate);
        const todayDateD = new Date(todayDate);

        try {
            if (userDateD < todayDateD)
                return interaction.reply({
                    content: `❌ La fecha introducida ya ha pasado.  ❌`,
                    ephemeral: true
                });

            if (day > 31)
                return interaction.reply({
                    content: `❌ El dìa introducido es incorrecto. ❌`,
                    ephemeral: true
                });
            if (hour > 23)
                return interaction.reply({
                    content: `❌ La hora introducida es incorrecta. ❌`,
                    ephemeral: true
                });
            if (minutes > 59)
                return interaction.reply({
                    content: `❌ Los minutos introducidos son incorrectos. ❌`,
                    ephemeral: true
                });

            if (minutes < 10) minutes = `0${minutes}`;
            if (hour < 10) hour = `0${hour}`;
            if (day < 10) day = `0${day}`;
            if (month + 1 < 10) month = `0${month}`;

            const cronTime = `${minutes} ${hour} ${day} ${month + 1} *`;

            for (let i = 0; i < userTasksToDelete.length; i++) {
                if (userTasksToDelete[i].Cron === cronTime) {
                    return interaction.reply({
                        content: `❌ No puedes editar un recordatorio con la misma fecha ❌`,
                        ephemeral: true
                    });
                }
            }

            await reminderSchema.updateOne(
                { UserID: interaction.user.id, ID: id },
                {
                    $set: {
                        Task: desc,
                        Date: userDate,
                        Cron: cronTime
                    }
                }
            );
        } catch (error) {
            webhook.send({
                content: `Error comando: **${interaction.commandName}**\`\`\`${err}\`\`\``
            });
        } finally {
            const date = userDate.split(" ")[0].split(",")[0];
            const hour = userDate.split(" ")[1];

            const embed = new EmbedBuilder()
                .setColor(`Orange`)
                .setDescription(
                    `✅ **Recordatorio Editado Correctamente**\n\n:eyes: Para **Ver un Recordatorio**, usa el comando\n \`/ver-recordatorios\`\n\n:wastebasket: Para **borrar un Recordatorio**, usa el comando\n \`/borrar-recordatorio**\``
                )
                .addFields(
                    { name: "\u200B", value: " " },
                    {
                        name: `📝 ${desc}`,
                        value: `📆 ${date}\n⏱️ ${hour}\n🆔 ${id}`,
                        inline: true
                    },
                    { name: "\u200B", value: " " }
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
