const { EmbedBuilder } = require("discord.js");
const child = require("child_process");
require("dotenv").config();

module.exports = {
    name: "terminal",
    description: "terminal",
    type: 1,
    options: [
        {
            type: 3,
            name: "comando",
            description: "Comando a enviar.",
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
                        .setDescription("⛔ No tienes permisos para ejecutar comandos.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        const command = interaction.options.getString("comando");

        child.exec(command, async (err, res) => {
            if (err)
                return interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`**ERROR:** \n\`\`\`js\n${err}\n\`\`\``)
                            .setColor("#EA3939")
                    ]
                });

            try {
                if (res.length > 2000) {
                    const { data } = await axios.post("https://bin.hzmi.xyz/documents", res);
                    await interaction
                        .reply({
                            content: "Eval...!",
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Result",
                                            url: `https://bin.hzmi.xyz/${data.key}.js`,
                                            style: 5
                                        }
                                    ]
                                }
                            ]
                        })
                        .then((msg) => {
                            setTimeout(() => msg.delete(), 20000);
                        });
                } else {
                    interaction
                        .reply(`\`\`\`js\n${res.slice(0, 2000)}\n\`\`\``, { code: "js" })
                        .then((msg) => {
                            setTimeout(() => msg.delete(), 20000);
                        });
                }
            } catch (e) {
                interaction.reply({ content: `-` });
            }
        });
    }
};
