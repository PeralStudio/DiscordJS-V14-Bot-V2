const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const xpSchema = require("../../../schemas/xpSchema");

module.exports = {
    name: "setnivel",
    description: "Aplicar un nivel a un Usuario.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario",
            required: true
        },
        {
            type: 10,
            name: "nivel",
            description: "Nivel",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para cambiar niveles.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        const member = interaction.options.getMember("usuario");
        const newlvl = interaction.options.getNumber("nivel");

        let user;

        const guildID = member.guild.id;
        const userID = member.user.id;

        user = await xpSchema.findOne({
            guildID,
            userID
        });

        try {
            await xpSchema
                .findOneAndUpdate(
                    {
                        user: `${member.user.username}`,
                        guildID,
                        userID
                    },
                    {
                        level: newlvl,
                        xp: 0
                    },
                    {
                        upsert: true,
                        new: true
                    }
                )
                .then(() =>
                    interaction.reply({
                        content:
                            `El Nivel de <@${member.user.id}> ha sido cambiado a  ` +
                            "`" +
                            newlvl +
                            "`"
                    })
                );
        } catch (error) {
            console.log(error);
        }
    }
};
