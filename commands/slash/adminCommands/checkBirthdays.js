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
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ **No tienes permisos para usar este comando.**")
                        .setColor("#EA3939")
                ]
            });
        }

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("🎉 Cumpleaños Registrados")
            .setDescription("Aquí tienes la lista de los cumpleaños registrados:")
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        bdSchema.find({}, async (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("❌ **Hubo un error al recuperar los cumpleaños.**")
                            .setColor("#EA3939")
                    ]
                });
            }

            if (data.length < 1) {
                embed.setDescription("❌ **No hay cumpleaños registrados.**");
            } else {
                data.forEach((user) => {
                    const age = age1(user.Year, user.Month, user.Day);
                    embed.addFields({
                        name: `${user.Username}`,
                        value: `📅 \`${user.Day}/${user.Month}/${user.Year}\`\n🎂 \`${age}\``,
                        inline: true
                    });
                });
            }

            interaction.reply({ embeds: [embed], ephemeral: true });
        });
    }
};
