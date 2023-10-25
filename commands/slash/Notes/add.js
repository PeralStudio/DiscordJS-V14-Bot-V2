const { EmbedBuilder } = require("discord.js");
const generator = require("generate-password");
const notesSchema = require("../../../schemas/notesSchema");
require("dotenv").config();

module.exports = {
    name: "nota",
    description: "Guardar una nota.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Nota a guardar.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const note = interaction.options.get("texto").value;

        const code = generator.generate({
            length: 5,
            lowercase: false,
            uppercase: false,
            numbers: true
        });

        notesSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (!data) {
                new notesSchema({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Code: code,
                    Note: note
                }).save();

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`**✅ Has guardado correctamente tu nota. **`)
                    .addFields(
                        { name: "Nota", value: `\`${note}\`` },
                        {
                            name: "ID",
                            value: `\`${code}\``
                        }
                    )
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                new notesSchema({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Code: code,
                    Note: note
                }).save();

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`**✅ Has guardado correctamente tu nota. **`)
                    .addFields(
                        { name: "Nota", value: `\`${note}\`` },
                        {
                            name: "ID",
                            value: `\`${code}\``
                        }
                    )
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        });
    }
};
