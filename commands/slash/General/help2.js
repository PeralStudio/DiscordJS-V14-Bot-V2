const { EmbedBuilder } = require("discord.js");
const { pagination, TypesButtons, StylesButton } = require("@devraelfreeze/discordjs-pagination");
require("dotenv").config();

module.exports = {
    name: "help2",
    description: "Texto en ASCII.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        let commands = [];

        client.slash_commands.map((cmd) => {
            commands.push(cmd);
        });

        const commandList = commands.map((command) => {
            return {
                value: `**/${command.name}** - ${command.description}`,
                name: `\u200b` // This is an invisible character, discord doesn't like empty fields
            };
        });

        const embed0 = new EmbedBuilder()
            .setColor(parseInt("#00ff00".replace("#", ""), 16))
            .setTitle(`Comandos Disponibles`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(splitedParts(commandList)[0])
            .setFooter({
                text: `${client.user.username} | ${interaction.guild.name}`
            });

        const embed1 = new EmbedBuilder()
            .setColor(parseInt("#00ff00".replace("#", ""), 16))
            .setTitle(`Comandos Disponibles`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(splitedParts(commandList)[1])
            .setFooter({
                text: `${client.user.username} | ${interaction.guild.name}`
            });

        const embed2 = new EmbedBuilder()
            .setColor(parseInt("#00ff00".replace("#", ""), 16))
            .setTitle(`Comandos Disponibles`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(splitedParts(commandList)[2])
            .setFooter({
                text: `${client.user.username} | ${interaction.guild.name}`
            });

        const embed3 = new EmbedBuilder()
            .setColor(parseInt("#00ff00".replace("#", ""), 16))
            .setTitle(`Comandos Disponibles`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(splitedParts(commandList)[3])
            .setFooter({
                text: `${client.user.username} | ${interaction.guild.name}`
            });

        const embed4 = new EmbedBuilder()
            .setColor(parseInt("#00ff00".replace("#", ""), 16))
            .setTitle(`Comandos Disponibles`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(splitedParts(commandList)[4])
            .setFooter({
                text: `${client.user.username} | ${interaction.guild.name}`
            });

        const embed5 = new EmbedBuilder()
            .setColor(parseInt("#00ff00".replace("#", ""), 16))
            .setTitle(`Comandos Disponibles`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(splitedParts(commandList)[5])
            .setFooter({
                text: `${client.user.username} | ${interaction.guild.name}`
            });

        let embeds = [embed0, embed1, embed2, embed3, embed4, embed5];

        await pagination({
            interaction: interaction,
            embeds: embeds, // Array of embeds objects
            author: interaction.member.user,
            time: 120000, // miliseconds for timeout
            fastSkip: false,
            disableButtons: true,
            pageTravel: false,
            /** Enable buttons pagination system only for member with ID: 123456789 */
            // customFilter: (interaction) => {
            //     return interaction.member.user.id === "123456789";
            // },
            buttons: [
                {
                    value: TypesButtons.previous,
                    label: "⬅️ Anterior",
                    style: StylesButton.Success,
                    emoji: null
                },
                {
                    value: TypesButtons.next,
                    label: "Siguiente ➡️",
                    style: StylesButton.Success,
                    emoji: null
                }
            ]
        });
    }
};

const splitedParts = (array) => {
    const longitud = array.length;

    const cutIndex1 = Math.ceil(longitud / 6);
    const cutIndex2 = Math.ceil(longitud / 3);
    const cutIndex3 = Math.ceil(longitud / 2);
    const cutIndex4 = Math.ceil(longitud / 1.5);
    const cutIndex5 = Math.ceil(longitud / 1.25);
    const cutIndex6 = Math.ceil(longitud / 1);

    const part1 = array.slice(0, cutIndex1);
    const part2 = array.slice(cutIndex1, cutIndex2);
    const part3 = array.slice(cutIndex2, cutIndex3);
    const part4 = array.slice(cutIndex3, cutIndex4);
    const part5 = array.slice(cutIndex4, cutIndex5);
    const part6 = array.slice(cutIndex5, cutIndex6);

    return [part1, part2, part3, part4, part5, part6];
};
