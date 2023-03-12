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
                const embedTiempo = new EmbedBuilder()

                    .setColor("#AA70F8")
                    .setTitle(
                        ` **${data.main.temp.toFixed(1)}\u00B0C** en ${data.name}, ${
                            data.sys.country
                        }`
                    )
                    .addFields(
                        {
                            name: "Máxima",
                            value: `${data.main.temp_max.toFixed(1)}\u00B0C`,
                            inline: true
                        },
                        {
                            name: "Mínima",
                            value: `${data.main.temp_min.toFixed(1)}\u00B0C`,
                            inline: true
                        },
                        {
                            name: "Humedad",
                            value: `${data.main.humidity}%`,
                            inline: true
                        },
                        {
                            name: "Viento",
                            value: `${data.wind.speed} m/s`,
                            inline: true
                        },
                        {
                            name: "Presión",
                            value: `${data.main.pressure} hPa`,
                            inline: true
                        },
                        {
                            name: "Nubes",
                            value: `${data.weather[0].description}`,
                            inline: true
                        }
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
                            value: `**${interaction.member.user.username}#${interaction.member.user.discriminator}**`,
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
