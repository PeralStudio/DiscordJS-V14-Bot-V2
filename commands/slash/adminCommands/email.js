const { EmbedBuilder } = require("discord.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = {
    name: "email",
    description: "Enviar Correo.",
    type: 1,
    options: [
        {
            type: 3,
            name: "destinatario",
            description: "Destinatario del email.",
            required: true,
        },
        {
            type: 3,
            name: "asunto",
            description: "Asunto del email.",
            required: true,
        },
        {
            type: 3,
            name: "contenido",
            description: "Contenido del email.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para enviar emails.")
                        .setColor("#EA3939"),
                ],
            });
            return;
        }

        const destinatario = interaction.options.get("destinatario").value;
        const asunto = interaction.options.get("asunto").value;
        const contenido = interaction.options.get("contenido").value;

        const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

        if (validEmail.test(destinatario)) {
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.GMAIL_KEY,
                },
            });

            var mailOptions = {
                from: process.env.EMAIL,
                to: destinatario,
                subject: asunto,
                text: contenido,
            };

            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`✅ Email enviado`)
                                .addFields([
                                    {
                                        name: "Destinatario",
                                        value: destinatario,
                                        inline: true,
                                    },
                                    {
                                        name: "Asunto",
                                        value: asunto,
                                        inline: true,
                                    },
                                    {
                                        name: "Contenido",
                                        value: contenido,
                                    },
                                ])
                                .setColor("#EA3939")
                                .setTimestamp()
                                .setFooter({
                                    text: process.env.NAME_BOT,
                                    iconURL: client.user.displayAvatarURL(),
                                }),
                        ],
                        ephemeral: true,
                    });
                }
            });
        } else {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ Introduce un email valido.")
                        .setColor("#EA3939"),
                ],
            });
            return;
        }
    },
};
