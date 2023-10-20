const { EmbedBuilder } = require("discord.js");
const bdSchema = require("../../../schemas/birthdaySchema");
require("dotenv").config();

const age1 = (birthYear, birthMonth, birthDay) => {
    const today = new Date();
    const birthdate = new Date(birthYear, birthMonth - 1, birthDay);
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
};

module.exports = {
    name: "ver-cumpleaños",
    description: "Ver los cumpleaños de los usuarios",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder().setDescription("⛔ No tienes permisos.").setColor("#EA3939")
                ]
            });
            return;
        }

        const embed = new EmbedBuilder().setColor("Blurple").setTimestamp().setFooter({
            text: process.env.NAME_BOT,
            iconURL: client.user.displayAvatarURL()
        });

        bdSchema.find({}, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                embed.setDescription("❌ No hay cumpleaños registrados.");

                interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                data.forEach(async (user) => {
                    const age = age1(user.Year, user.Month, user.Day);
                    embed.addFields({
                        name: `${user.Username}`,
                        value: `\`${user.Day}/${user.Month}/${user.Year}\nEdad: ${age}\`\n\n`,
                        inline: true
                    });
                });

                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        });
    }
};
