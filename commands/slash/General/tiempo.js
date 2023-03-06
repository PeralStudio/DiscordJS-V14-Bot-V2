const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

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
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${
                interaction.options.get("ciudad").value
            }&units=metric&appid=40efccd434eefd0344923485b60fbda7&lang=es`
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

                interaction.reply({ embeds: [embedTiempo] });
            })
            .catch((err) => console.log(err));
    }
};
