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
    name: "mi-cumpleaños",
    description: "Ver mi fecha cumpleaños registrada en la base de datos",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const embed = new EmbedBuilder();
        bdSchema
            .find({
                UserID: interaction.user.id
            })
            .then((data) => {
                if (data.length < 1 || data === null || data === undefined) {
                    embed
                        .setDescription(
                            `❌ No tienes ninguna fecha registrada en la base de datos \n\nPara registrar un cumpleaños, use el comando **/registrar-cumpleaños**`
                        )
                        .setColor("#db1e1e")
                        .setFooter({
                            text: process.env.NAME_BOT,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTimestamp();

                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    data.forEach(async (user) => {
                        const age = age1(user.Year, user.Month, user.Day);
                        embed
                            .setColor("Blurple")
                            .setDescription(
                                `<@${user.UserID}> esta es la fecha que has registrado en la base de datos.`
                            )
                            .addFields({
                                name: ` `,
                                value: `\`${user.Day}/${user.Month}/${user.Year}\nEdad: ${age}\n\``,
                                inline: true
                            })
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter({
                                text: process.env.NAME_BOT,
                                iconURL: client.user.displayAvatarURL()
                            });
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                    });
                }
            });
    }
};
