const request = require("request");
const cherio = require("cherio");
require("dotenv").config();

module.exports = {
    name: "elrellano",
    description: "Vídeos de elrellano.com",
    type: 1,
    options: [
        {
            type: 4,
            name: "página",
            description: "Página a mostrar",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        let arrayVideos = [];
        const author = interaction.user.id;
        const page = interaction.options.get("página").value;

        await request(`https://elrellano.com/videos/page/${page}/`, async (err, res, html) => {
            if (page <= 0) {
                interaction.reply({
                    content: "❌ La primera página suele ser la `1` bobo.",
                    ephemeral: true,
                });
                return;
            }
            if (page > 1950) {
                interaction.reply({
                    content: `❌ No hay tantas páginas.`,
                    ephemeral: true,
                });
                return;
            }

            if (!err && res.statusCode == 200) {
                const $ = cherio.load(html);

                $("video").map(function () {
                    // console.log($(this).attr("src"));
                    arrayVideos.push($(this).attr("src"));
                });

                if (arrayVideos.length <= 0) {
                    interaction.reply({
                        content: "❌ No se han encontrado videos. Intentalo mas tarde!",
                        ephemeral: true,
                    });
                    return;
                }

                await client.users
                    .fetch(author)
                    .then((user) => {
                        user.send({
                            content: `${arrayVideos[0] !== undefined ? arrayVideos[0] : ""}\n${
                                arrayVideos[1] !== undefined ? arrayVideos[1] : ""
                            }\n${arrayVideos[2] !== undefined ? arrayVideos[2] : ""}\n${
                                arrayVideos[3] !== undefined ? arrayVideos[3] : ""
                            }\n${arrayVideos[4] !== undefined ? arrayVideos[4] : ""}\n`,
                        });
                    })
                    .finally(() => {
                        interaction.reply({
                            content: ":white_check_mark: ¡ Se han enviado los vídeos a tu DM !",
                            ephemeral: true,
                        });
                    });
            } else {
                interaction.reply({
                    content: "❌ Error en la petición. Intentalo mas tarde!",
                    ephemeral: true,
                });
            }
        });
    },
};
