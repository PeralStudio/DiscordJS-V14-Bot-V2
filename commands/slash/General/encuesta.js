const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "encuesta",
    description: "Cear encuesta",
    type: 1,
    options: [
        {
            type: 3,
            name: "pregunta",
            description: "Pregunta de la encuesta.",
            required: true,
        },
        {
            type: 3,
            name: "opción-1",
            description: "Respuesta 1 de la encuesta.",
            required: true,
        },
        {
            type: 3,
            name: "opción-2",
            description: "Respuesta 2 de la encuesta.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const pregunta = interaction.options.get("pregunta").value; //Definimos que "Pregunta, opcion1, opcion2" equivale a test, el .split de test fue para separar estas definiciones
        const opcion1 = interaction.options.get("opción-1").value;
        const opcion2 = interaction.options.get("opción-2").value;

        let [react1, react2] = ["1️⃣", "2️⃣"];

        const embedEncuesta = new EmbedBuilder() //Creamos el embed con el nombre encuesta

            .setTitle(`${pregunta} \n`)
            .addFields(
                {
                    name: react1,
                    value: opcion1,
                    inline: true,
                },
                {
                    name: react2,
                    value: opcion2,
                    inline: true,
                }
            )
            .setFooter({
                text: `${interaction.member.user.tag} \n`,
                iconURL: interaction.member.user.displayAvatarURL(),
            })
            .setThumbnail(
                "https://upload.wikimedia.org/wikipedia/commons/d/dd/Strawpoll-logo-large.png"
            )
            .setTimestamp()
            .setColor("#0099ff");

        const msg = await interaction.reply({
            embeds: [embedEncuesta],
            fetchReply: true,
        }); //Mandamos el embed y lo guardamos en una variable msg

        await msg.react(`${react1}`), await msg.react(`${react2}`);
    },
};
