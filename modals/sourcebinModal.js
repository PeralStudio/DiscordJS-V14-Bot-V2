const {
    EmbedBuilder,
    WebhookClient,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const { create } = require("sourcebin");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    id: "crear-sourcebin",
    run: async (client, interaction, config) => {
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

        const name = interaction.fields.getTextInputValue("name");
        const content = interaction.fields.getTextInputValue("content");
        const selectedType = interaction.fields.getTextInputValue("type");

        try {
            const response = await create({
                title: name,
                files: [
                    {
                        content,
                        language: selectedType
                    }
                ]
            });

            const embed = new EmbedBuilder()
                .setAuthor({
                    name,
                    iconURL:
                        "https://images-ext-2.discordapp.net/external/aCg8O38sCSk_yTNkGDKwr0Dubte-k--DIoPh4bRWx4Y/%3Fquality%3Dlossless/https/cdn.discordapp.com/emojis/1110173994474283071.png",
                    url: response.url
                })
                .setThumbnail("https://cdn3.emoji.gg/emojis/1115_green_tick.gif")
                .setDescription(`**Se ha creado el SourceBin**\n⤷  [Click aqui](${response.url})\n`)
                .setColor("#00ff00")
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Click para abrir el SourceBing")
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
