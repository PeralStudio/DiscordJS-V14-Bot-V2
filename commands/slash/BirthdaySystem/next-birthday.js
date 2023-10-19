const { EmbedBuilder } = require("discord.js");
const bdSchema = require("../../../schemas/birthdaySchema");
require("dotenv").config();

module.exports = {
    name: "proximo-cumpleaños",
    description: "Muestra el tiempo que falta para tu próximo cumpleaños",
    type: 1,
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const data = await bdSchema.findOne({ UserID: interaction.user.id });
        if (!data) {
            return interaction.reply({
                content: `Aún no has configurado tu cumpleaños. Utiliza /cumpleaños para establecerlo.`,
                ephemeral: true
            });
        }

        const today = new Date();
        const nextBirthday = new Date(today.getFullYear(), data.Month - 1, data.Day);

        if (today > nextBirthday) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const timeUntilBirthday = nextBirthday - today;
        const daysUntilBirthday = Math.ceil(timeUntilBirthday / (1000 * 60 * 60 * 24));
        const monthsUntilBirthday = Math.floor(daysUntilBirthday / 30);
        const remainingDays = daysUntilBirthday % 30;

        let h = "";

        if (monthsUntilBirthday > 0) {
            h += `${monthsUntilBirthday} Mes(es)`;
            if (remainingDays > 0) {
                h += `, ${remainingDays} Día(s)`;
            }
        } else {
            h += `${daysUntilBirthday} Día(s)`;
        }

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`${interaction.user.username} | Próximo Cumpleaños`)
            .setDescription(`**👉 Tu Próximo Cumpleaños es en \`${h}\`**`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
