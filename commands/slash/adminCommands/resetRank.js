const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const { Rank } = require("canvacord");
const xpSchema = require("../../../schemas/xpSchema");

module.exports = {
    name: "resetnivel",
    description: "Resetear nivel de usuario.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario al que resetear nivel",
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
                        .setDescription("⛔ No tienes permisos para resetear niveles.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        const member = interaction.options.getMember("usuario");
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
                        level: 1,
                        xp: 0
                    },
                    {
                        upsert: true,
                        new: true
                    }
                )
                .then(() =>
                    interaction.reply({
                        content: `El Nivel de <@${member.user.id}> ha sido reseteado correctamente`
                    })
                );
        } catch (error) {
            console.log(error);
        }
    }
};
