const { EmbedBuilder, WebhookClient } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "tiempo",
    description: "Mostrar el tiempo actual.",
    type: 1,
    options: [
        {
            type: 3,
            name: "ciudad",
            description: "Ciudad a mostrar el tiempo.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const city = interaction.options.get("ciudad").value;

        await interaction.deferReply({ content: "Cargando...", ephemeral: true });

        await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=40efccd434eefd0344923485b60fbda7&lang=es`
        )
            .then((res) => res.json())
            .then((data) => {
                const dateSunset = new Date(data.sys.sunset * 1000);
                const optionsSunset = {
                    timeZone: "Europe/Madrid",
                    hour: "numeric",
                    minute: "numeric"
                };

                const dateSunrise = new Date(data.sys.sunrise * 1000);
                const optionsSunrise = {
                    timeZone: "Europe/Madrid",
                    hour: "numeric",
                    minute: "numeric"
                };

                const dateSunsetFormat = dateSunset
                    .toLocaleDateString("es-ES", optionsSunset)
                    .split(",")[1];
                const dateSunriseFormat = dateSunrise
                    .toLocaleDateString("es-ES", optionsSunrise)
                    .split(",")[1];

                const embedTiempo = new EmbedBuilder()
                    .setColor("#AA70F8")
                    .setTitle(
                        ` **${data.main.temp.toFixed(1)} \u00B0C** en ${data.name}, ${
                            data.sys.country
                        }`
                    )
                    .addFields(
                        { name: "\u200B", value: " " },
                        {
                            name: "Máxima",
                            value: `${data.main.temp_max.toFixed(1)} \u00B0C`,
                            inline: true
                        },
                        {
                            name: "Mínima",
                            value: `${data.main.temp_min.toFixed(1)} \u00B0C`,
                            inline: true
                        },
                        {
                            name: "Nubes",
                            value: `${
                                data.weather[0].description.charAt(0).toUpperCase() +
                                data.weather[0].description.slice(1)
                            }`,
                            inline: true
                        },
                        {
                            name: "Viento",
                            value: `${data.wind.speed} m/s`,
                            inline: true
                        },
                        {
                            name: "Humedad",
                            value: `${data.main.humidity}%`,
                            inline: true
                        },
                        {
                            name: "Sensación térmica",
                            value: `${data.main.feels_like.toFixed(1)} \u00B0C`,
                            inline: true
                        },
                        {
                            name: "Presión",
                            value: `${data.main.pressure} hPa`,
                            inline: true
                        },
                        {
                            name: "Salida de sol",
                            value: `${dateSunriseFormat}`,
                            inline: true
                        },
                        {
                            name: "Puesta de sol",
                            value: `${dateSunsetFormat}`,
                            inline: true
                        },
                        { name: "\u200B", value: " " }
                    )
                    .setThumbnail(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`)
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.editReply({ embeds: [embedTiempo] });
            })
            .catch((err) => {
                interaction.editReply({
                    content:
                        "❌ Error al obtener el tiempo. Verifica que la ciudad ingresada es correcta: `" +
                        city +
                        "`"
                });

                const errorEmbed = new EmbedBuilder()
                    .setColor("#db1e1e")
                    .setTitle("Error al obtener el tiempo")
                    .addFields(
                        {
                            name: "Comando:",
                            value: `**${interaction.commandName}**`,
                            inline: true
                        },
                        {
                            name: "Ciudad:",
                            value: `**${city}**`,
                            inline: true
                        },
                        {
                            name: "Usuario:",
                            value: `**${interaction.member.user.username}**`,
                            inline: true
                        },
                        {
                            name: "Servidor:",
                            value: `**${interaction.guild.name}**`,
                            inline: true
                        },
                        {
                            name: "Error:",
                            value: `**${err}**`,
                            inline: false
                        }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                webhook.send({ embeds: [errorEmbed] });
            });
    }
};
