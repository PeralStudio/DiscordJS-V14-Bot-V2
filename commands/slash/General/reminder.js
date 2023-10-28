const { EmbedBuilder } = require("discord.js");
const cron = require("node-cron");
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
        let today = new Date();
        let month = today.getMonth();
        let desc = interaction.options.getString(`descripción`);

        const userDate = new Date(
            `${today.getFullYear()}-${month + 1}-${day} ${hour}:${minutes} `
        ).toLocaleString("es-ES");

        const todayDate = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

        if (userDate < todayDate)
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

        const embed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(`✅ Recordatorio Creado Correctamente`)
            .setDescription(
                `Cuando finalice el temporizador del recordatorio,\n se enviará el recordatorio por mensaje privado`
            )
            .addFields(
                { name: "\u200B", value: " " },
                {
                    name: `📆  ${day}/${
                        month + 1
                    }/${today.getFullYear()}\n⏱️  ${hour}:${minutes}\n\n📝 Tarea: ${desc}`,
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
                job.stop();
            },
            {
                timezone: "Europe/Madrid"
            }
        );

        job.start();
    }
};
