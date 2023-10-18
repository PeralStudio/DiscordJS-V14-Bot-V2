const { EmbedBuilder } = require("discord.js");
const bdSchema = require("../../../schemas/birthdaySchema");

function age1(birthYear, birthMonth, birthDay) {
    const today = new Date();
    const birthdate = new Date(birthYear, birthMonth - 1, birthDay);
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

module.exports = {
    name: "reset-cumpleaños",
    description: "Restablecer la fecha de nacimiento",
    type: 1,
    options: [
        {
            type: 4,
            name: "dia",
            description: "Día del cumpleaños",
            required: true
        },

        {
            type: 4,
            name: "mes",
            description: "Mes del cumpleaños",
            required: true
        },
        {
            type: 4,
            name: "año",
            description: "Año del cumpleaños",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const birthDay = interaction.options.getInteger("dia");
        const birthMonth = interaction.options.getInteger("mes");
        const birthYear = interaction.options.getInteger("año");
        const age = age1(birthYear, birthMonth, birthDay);

        const data = await bdSchema.findOne({ UserID: interaction.user.id });

        if (!data) {
            return interaction.reply({
                content: `Aún no has fijado tu cumpleaños. Usa /cumpleaños para fijarlo.`,
                ephemeral: true
            });
        } else {
            await bdSchema.findOneAndUpdate(
                { UserID: interaction.user.id },
                { Age: age, Year: birthYear, Month: birthMonth, Day: birthDay }
            );

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`${interaction.user.username} | Restablecimiento de cumpleaños`)
                .setDescription(`**👉 La información de tu cumpleaños se ha restablecido.**`);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
