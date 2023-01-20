const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1065927755339927652/Un42hZ5ScggZFpnu9CfnQbvXNUxZbdPOzK1VCuD-tceqYlKTb3LFwAqYw4jofFl-vONn",
});

module.exports = (client) => {
    const versionbot = "AlfanjorBot v2.0 Peralstudio.com";

    const embed = new EmbedBuilder().setColor("Red");

    client.on("error", (err) => {
        console.log(err);

        embed
            .setTitle("Discord API Error")
            .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
            .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL(),
            });

        return webhook.send({ embeds: [embed] });
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.log(reason, "\n", promise);

        embed
            .setTitle("Unhandled Rejection/Catch")
            .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
            .addFields(
                {
                    name: "Reason",
                    value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``,
                },
                {
                    name: "Promise",
                    value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``,
                }
            )
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL(),
            });

        return webhook.send({ embeds: [embed] });
    });

    process.on("uncaughtException", (err, origin) => {
        console.log(err, "\n", origin);

        embed
            .setTitle("Uncaught Exception/Catch")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
            .addFields(
                {
                    name: "Error",
                    value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
                },
                {
                    name: "Origin",
                    value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
                }
            )
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL(),
            });

        return webhook.send({ embeds: [embed] });
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(err, "\n", origin);

        embed
            .setTitle("Uncaught Exception Monitor")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
            .addFields(
                {
                    name: "Error",
                    value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
                },
                {
                    name: "Origin",
                    value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
                }
            )
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL(),
            });

        return webhook.send({ embeds: [embed] });
    });

    process.on("warning", (warn) => {
        console.log(warn);

        embed
            .setTitle("Uncaught Exception Monitor Warning")
            .setURL("https://nodejs.org/api/process.html#event-warning")
            .addFields({
                name: "Warning",
                value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``,
            })
            .setTimestamp()
            .setFooter({
                text: versionbot,
                iconURL: client.user.displayAvatarURL(),
            });

        return webhook.send({ embeds: [embed] });
    });
};
