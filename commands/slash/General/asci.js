const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const figlet = require("figlet");

module.exports = {
    name: "asci",
    description: "Texto en ASCII.",
    type: 1,
    options: [
        {
            type: 3,
            name: "texto",
            description: "Texto a convertir en ASCII.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        if (interaction.options.get("texto").value.slice(1).length > 15) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⚠️ El texto no puede superar los **15** caracteres.")
                        .setColor("#EA3939"),
                ],
            });
            return;
        }
        figlet(
            interaction.options
                .get("texto")
                .value.slice(process.env.PREFIX.length - 1)
                .split(" ")
                .join(" "),
            (err, data) => interaction.reply("```" + data + "```")
        );
    },
};
