const { EmbedBuilder } = require("discord.js");
const notesSchema = require("../../../schemas/notesSchema");
require("dotenv").config();

module.exports = {
    name: "borrar-nota",
    description: "Borrar una nota.",
    type: 1,
    options: [
        {
            type: 4,
            name: "id",
            description: "ID de la nota a borrar",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const id = interaction.options.get("id").value;

        notesSchema.findOne({ Guild: interaction.guild.id, Code: id }, async (err, data) => {
            if (data) {
                notesSchema.findOneAndDelete({ Guild: interaction.guild.id, Code: id }).then(() => {
                    const embed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription(`**✅ Has borrado correctamente tu nota. **`)
                        .addFields(
                            { name: "Nota", value: `\`${data.Note}\`` },
                            {
                                name: "ID",
                                value: `\`${data.Code}\``
                            }
                        )
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        });

                    interaction.reply({ embeds: [embed], ephemeral: true });
                });
            } else {
                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`**❌ No se ha encontrado ninguna nota con ese ID. **`)
                    .addFields({
                        name: "ID",
                        value: `\`${id}\``
                    })
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    });

                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        });
    }
};
