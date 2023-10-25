const { EmbedBuilder } = require("discord.js");
const notesSchema = require("../../../schemas/notesSchema");
require("dotenv").config();

module.exports = {
    name: "ver-notas",
    description: "Vern notas.",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const rawboard = await notesSchema.find({
            Guild: interaction.guild.id,
            User: interaction.user.id
        });

        if (rawboard.length < 1)
            return interaction.reply({ content: "No tienes ninguna nota.", ephemeral: true });

        const lb = rawboard.map((e) => `**ID: ${e.Code}** \n${e.Note} \n`);

        const embedNotes = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Notas")
            .addFields({ name: " ", value: lb.join("\n"), inline: true })
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embedNotes], ephemeral: true });
    }
};
