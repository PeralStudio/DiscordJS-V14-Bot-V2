const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    WebhookClient
} = require("discord.js");
require("dotenv").config();
const { create, get, url } = require("sourcebin");

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "sourcebin",
    description: "Crear un archivo en SourceBin",
    type: 1,
    options: [
        {
            type: 3,
            name: "contenido",
            description: "Contenido a enviar a SourceBin",
            required: true
        },
        {
            type: 3,
            name: "nombre",
            description: "Nombre del archivo a enviar a SourceBin",
            required: true
        },
        {
            type: 3,
            name: "tipo",
            description: "Tipo de archivo a enviar a SourceBin",
            required: true,
            choices: [
                {
                    name: "🔡 Texto",
                    value: "texto"
                },
                {
                    name: "🧑‍💻 JavaScript",
                    value: "javascript"
                }
            ]
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const content = interaction.options.getString("contenido");
        const name = interaction.options.getString("nombre");
        const selectedType = interaction.options.get("tipo").value;

        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para crear un SourceBin.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        try {
            const response = await create({
                title: name,
                files: [
                    {
                        content,
                        language: selectedType === "texto" ? "text" : "javascript"
                    }
                ]
            });

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL:
                        "https://images-ext-2.discordapp.net/external/aCg8O38sCSk_yTNkGDKwr0Dubte-k--DIoPh4bRWx4Y/%3Fquality%3Dlossless/https/cdn.discordapp.com/emojis/1110173994474283071.png",
                    url: response.url
                })
                .setTitle("Sourcebing Creado")
                .setDescription(
                    `**Se ha creado el SourceBing**\n\n⤷  [Click aqui](${response.url})`
                )
                .setColor("#00ff00")
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Click para abrir el sourcebing ")
                    .setURL(response.url)
                    .setStyle(ButtonStyle.Link)
            );

            await interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            webhook.send({
                content: `Error al crear el sourcebin: ${error}`
            });
            await interaction.reply("Ha ocurrido un error al crear el sourcebin.");
        }
    }
};
