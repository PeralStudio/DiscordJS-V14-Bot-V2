const { EmbedBuilder } = require("discord.js");
const notesSchema = require("../../../schemas/notesSchema");
require("dotenv").config();

module.exports = {
    name: "editar-nota",
    description: "Editar nota.",
    type: 1,
    options: [
        {
            type: 4,
            name: "id",
            description: "ID de la nota a editar",
            required: true
        },

        {
            type: 3,
            name: "texto",
            description: "Texto de la nota.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const id = interaction.options.get("id").value;
        const note = interaction.options.get("texto").value;

        notesSchema.findOne({ Guild: interaction.guild.id, Code: id }, async (err, data) => {
            if (data) {
                data.Note = note;
                data.save();

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`**✅ Has editado correctamente tu nota. **`)
                    .addFields(
                        { name: "Nota", value: `\`${note}\`` },
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

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                client.errNormal({ error: `No note found!`, type: "editreply" }, interaction);
            }
        });
    }
};
