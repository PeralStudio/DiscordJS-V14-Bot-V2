const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
require("dotenv").config();

module.exports = {
    name: "github",
    description: "Información de perfil Github.",
    type: 1,
    options: [
        {
            type: 3,
            name: "usuario",
            description: "Usuario github.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const user = interaction.options.get("usuario").value;

        fetch(`https://api.github.com/users/${user}`)
            .then((response) => response.json())
            .then(async (json) => {
                const embed = new EmbedBuilder()
                    .setTitle(json.login)
                    .setURL(json.html_url)
                    .setThumbnail(json.avatar_url)
                    .addFields(
                        {
                            name: "Nombre",
                            value: json.login || "No se ha encontrado",
                            inline: true,
                        },
                        {
                            name: "Repositorios públicos",
                            value: json.public_repos.toString() || "0",
                            inline: true,
                        },
                        {
                            name: "Seguidores",
                            value: json.followers.toString() || "0",
                            inline: true,
                        },
                        {
                            name: "Bio",
                            value: json.bio || "Sin bio",
                            inline: true,
                        },
                        {
                            name: "Creación",
                            value: moment(json.created_at).format("DD-MM-YYYY") || "Sin datos",
                            inline: true,
                        },
                        {
                            name: "Modificado",
                            value: moment(json.updated_at).format("DD-MM-YYYY") || "Sin datos",
                            inline: true,
                        },
                        {
                            name: "Github",
                            value: json.html_url || "Sin datos",
                        },
                        {
                            name: "Web",
                            value: json.blog || "Sin datos",
                        }
                    )
                    .setColor("#191919")
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL(),
                    });
                await interaction.reply({ embeds: [embed] });
            })
            .catch((err) => console.log("Solicitud fallida", err));
    },
};
