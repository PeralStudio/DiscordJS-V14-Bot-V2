const { EmbedBuilder } = require("discord.js");
const cron = require("node-cron");
const generator = require("generate-password");
const reminderSchema = require("../../../schemas/reminderSchema");
require("dotenv").config();

module.exports = {
    name: "recordatorio",
    description: "Crear recordatorio",
    type: 1,
    options: [
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
        let day = interaction.options.getInteger(`dia`);
        let hour = interaction.options.getInteger(`hora`);
        let minutes = interaction.options.getInteger(`minutos`);
        let desc = interaction.options.getString(`descripción`);
        let today = new Date();
        let month = today.getMonth();
        const codeID = generator.generate({
            length: 5,
            lowercase: false,
            uppercase: false,
            numbers: true
        });

        const userTasks = await reminderSchema.find({ UserID: interaction.user.id });

        if (userTasks.length >= 3)
            return interaction.reply({
                content: `❌ No puedes crear más de 3 recordatorios. ❌`,
                ephemeral: true
            });

        const userDate = new Date(
            `${today.getFullYear()}-${month + 1}-${day} ${hour}:${minutes}`
        ).toLocaleString("es-ES");

        const todayDate = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

        var userDateD = new Date(userDate);
        var todayDateD = new Date(todayDate);

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

        for (const task of userTasks) {
            if (task.Cron === cronTime)
                return interaction.reply({
                    content: `❌ Ya tienes un recordatorio para esa fecha. ❌`,
                    ephemeral: true
                });
        }

        const embed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(`✅ Recordatorio Creado Correctamente`)
            .setDescription(
                `Cuando sea la fecha y hora indicada,\n se te se enviará el recordatorio por mensaje privado.`
            )
            .addFields(
                { name: "\u200B", value: " " },
                {
                    name: `📆  ${day}/${
                        month + 1
                    }/${today.getFullYear()}\n⏱️  ${hour}:${minutes}\n\n📝 Tarea: ${desc}\n🆔 **${codeID}**`,
                    value: " "
                },
                { name: "\u200B", value: " " }
            )
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        await reminderSchema.create({
            ID: codeID,
            Guild: interaction.guild.id,
            UserID: interaction.user.id,
            Username: interaction.user.username,
            Task: desc,
            Date: userDate,
            Cron: cronTime
        });

        const job = cron.schedule(
            cronTime,
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
                            value: `📝 Tarea: **${desc}**`
                        },
                        { name: "\u200B", value: " " }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                await interaction.user.send({ embeds: [remindEmbed] });

                await reminderSchema.findOneAndDelete({
                    Guild: interaction.guild.id,
                    UserID: interaction.user.id,
                    Task: desc,
                    Date: userDate
                });
                job.stop();
            },
            {
                timezone: "Europe/Madrid"
            }
        );

        job.start();
    }
};
