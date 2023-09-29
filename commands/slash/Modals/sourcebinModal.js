const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "crear-sourcebin",
    description: "Crea un documento en SourceBin",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const modal = new ModalBuilder()
            .setCustomId("crear-sourcebin")
            .setTitle("Enviar SourceBin");

        const name = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Nombre del Documento")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Nombre...");

        const type = new TextInputBuilder()
            .setCustomId("type")
            .setLabel("Tipo de Documento")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("text, js, html, css, etc...");

        const content = new TextInputBuilder()
            .setCustomId("content")
            .setLabel("Contenido")
            .setStyle(TextInputStyle.Short)
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Contenido...");

        const firstActionRow = new ActionRowBuilder().addComponents(name);
        const secondActionRow = new ActionRowBuilder().addComponents(type);
        const thirdActionRow = new ActionRowBuilder().addComponents(content);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        await interaction.showModal(modal);
    }
};
