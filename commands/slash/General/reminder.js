const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "recordatorio",
    description: "Crear recordatorio",
    type: 1,
    options: [
        {
            type: 3,
            name: "tiempo",
            description: "Tiempo para el recordatorio",
            required: true,
            choices: [
                { name: "1m", value: "60" },
                { name: "2m", value: "120" },
                { name: "5m", value: "300" },
                { name: "10m", value: "600" },
                { name: "15m", value: "900" },
                { name: "20m", value: "1200" },
                { name: "30m", value: "1800" },
                { name: "45m", value: "2700" },
                { name: "1h", value: "3600" },
                { name: "2hs", value: "7200" },
                { name: "3hs", value: "10800" },
                { name: "5hs", value: "18000" },
                { name: "10hs", value: "36000" }
            ]
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
        const desc = interaction.options.getString(`descripción`);
        const time = interaction.options.getString(`tiempo`);
        const author = interaction.user.id;

        const seconds = Math.floor(time % 60);
        const minutes = Math.floor((time / 60) % 60);
        const hours = Math.floor((time / 60 / 60) % 24);

        const formattedTime = [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0")
        ].join(":");

        const embed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(`Recordatorio Creado Correctamente`)
            .setDescription(
                `Cuando finalice el temporizador del recordatorio,\n se enviará el recordatorio por mensaje privado`
            )
            .addFields(
                { name: "\u200B", value: " " },
                {
                    name: `⏱️ Tiempo: ${formattedTime}\n\n📝 Tarea: ${desc}`,
                    value: " "
                },
                { name: "\u200B", value: " " }
            )
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        const remindEmbed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(`✅ Recordatorio`)
            .setDescription(
                `Tu temporizador de recordatorio ha terminado.\n Es hora de: **${desc}**`
            )
            .addFields({ name: "\u200B", value: " " })
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });

        setTimeout(async () => {
            await client.users.fetch(author).then((user) => {
                user.send({ embeds: [remindEmbed] });
            });
        }, time * 1000);
    }
};
