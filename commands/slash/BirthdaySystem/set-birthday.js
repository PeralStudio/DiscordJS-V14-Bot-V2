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
    name: "cumpleaños",
    description: "Guarda el cumpleaños de un usuario",
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
            await bdSchema.create({
                UserID: interaction.user.id,
                Age: age,
                Year: birthYear,
                Month: birthMonth,
                Day: birthDay
            });

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`${interaction.user.username} | Birthday`)
                .setDescription(
                    `**👉 Has configurado correctamente tu fecha de nacimiento (\`${birthMonth}/${birthDay}/${birthYear}\`)[\`${age}\`]**`
                );
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({
                content: `Ya has configurado tu fecha de cumpleaños. Utiliza /reset-cumpleaños para restablecerla.`,
                ephemeral: true
            });
        }
    }
};
