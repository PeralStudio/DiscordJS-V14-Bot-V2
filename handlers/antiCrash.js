const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const deleteOldMsg = require("../services/deleteOldMsg");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = (client) => {
    const versionbot = "AlfanjorBot v2.0 Peralstudio.com";

    const embed = new EmbedBuilder().setColor("Red");

    client.on("error", (err) => {
        deleteOldMsg(client, process.env.ERRORES_BOT_CHANNEL);
        console.log(err);

        embed
            .setTitle("Discord API Error")
            .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
            .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL()
            });

        return webhook.send({ embeds: [embed] });
    });

    process.on("unhandledRejection", (reason, promise) => {
        deleteOldMsg(client, process.env.ERRORES_BOT_CHANNEL);

        // Crear un nuevo embed
        const embed = new EmbedBuilder()
            .setTitle("Unhandled Rejection/Catch")
            .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client?.user?.displayAvatarURL()
            });

        // Inspeccionar y limitar el tamaño del contenido
        const reasonText = inspect(reason, { depth: 0 }).slice(0, 1000);
        const promiseText = inspect(promise, { depth: 0 }).slice(0, 1000);

        // Añadir campos, asegurando que no excedan el límite
        embed.addFields(
            {
                name: "Reason",
                value: `\`\`\`${reasonText}\`\`\``
            },
            {
                name: "Promise",
                value: `\`\`\`${promiseText}\`\`\``
            }
        );

        // Verificar el número de campos antes de enviar
        if (embed.data.fields.length <= 25) {
            webhook.send({ embeds: [embed] });
        } else {
            console.error("El embed tiene más de 25 campos, no se enviará.");
        }
    });

    process.on("uncaughtException", (err, origin) => {
        deleteOldMsg(client, process.env.ERRORES_BOT_CHANNEL);
        console.log(err, "\n", origin);

        embed
            .setTitle("Uncaught Exception/Catch")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
            .addFields(
                {
                    name: "Error",
                    value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
                },
                {
                    name: "Origin",
                    value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
                }
            )
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL()
            });

        return webhook.send({ embeds: [embed] });
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        deleteOldMsg(client, process.env.ERRORES_BOT_CHANNEL);
        console.log(err, "\n", origin);

        embed
            .setTitle("Uncaught Exception Monitor")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
            .addFields(
                {
                    name: "Error",
                    value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
                },
                {
                    name: "Origin",
                    value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
                }
            )
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL()
            });

        return webhook.send({ embeds: [embed] });
    });

    process.on("warning", (warn) => {
        deleteOldMsg(client, process.env.ERRORES_BOT_CHANNEL);
        console.log(warn);

        embed
            .setTitle("Uncaught Exception Monitor Warning")
            .setURL("https://nodejs.org/api/process.html#event-warning")
            .addFields({
                name: "Warning",
                value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``
            })
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL()
            });

        return webhook.send({ embeds: [embed] });
    });
};
