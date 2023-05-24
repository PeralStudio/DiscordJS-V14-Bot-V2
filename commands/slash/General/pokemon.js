const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

module.exports = {
    name: "pokemon",
    description: "Mostrar información de la pokedéx de un pokemón",
    type: 1,
    options: [
        {
            type: 3,
            name: "nombre-o-id",
            description: "Nombre o ID del pokemón",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        await interaction.deferReply();

        const busqueda = interaction.options.get("nombre-o-id");
        const url_api = `https://pokeapi.co/api/v2/pokemon/${busqueda.value}`;
        let response = null;

        //Verificar si existe el pokemón
        try {
            response = await axios.get(url_api);
        } catch (error) {
            interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#7bb8bd")
                        .setDescription(
                            `No se encontró ningún pokemón con el id \`${busqueda.value}\``
                        )
                ],
                ephemeral: true
            });
            await interaction.deleteReply();
        }

        const pokemonData = response.data;
        const pokemonName = pokemonData.name;
        const pokemonHeight = (pokemonData.height / 3.281).toFixed(2);
        const pokemonWeight = pokemonData.weight;
        const pokemonTypes = pokemonData.types.map((tipo) => tipo.type.name);
        const defaultSpriteUrl = pokemonData.sprites.front_default;
        const shinySpriteUrl = pokemonData.sprites.front_shiny;
        const officialArtworDefaultSpriteUrl =
            pokemonData.sprites.other["official-artwork"].front_default;
        const shinyArtworDefaultSpriteUrl =
            pokemonData.sprites.other["official-artwork"].front_shiny;

        //Páginas
        var embeds = [];

        const EmbedDefault = new EmbedBuilder()
            .setTitle(`Pokedéx | \`${pokemonName}\``)
            .setColor("#7bb8bd")
            .setImage(officialArtworDefaultSpriteUrl)
            .setThumbnail(defaultSpriteUrl)
            .addFields(
                { name: `Peso`, value: `${pokemonWeight} kg`, inline: true },
                { name: `Altura`, value: `${pokemonHeight} m`, inline: true },
                { name: `Tipos`, value: `${pokemonTypes.join(", ")}` }
            )
            .setTimestamp();

        const EmbedShiny = new EmbedBuilder()
            .setTitle(`Pokedéx | \`${pokemonName} shiny\``)
            .setColor("#410000")
            .setDescription(
                `${interaction.user?.username} buscó a al pokemón \`${busqueda.value}\``
            )
            .setImage(shinyArtworDefaultSpriteUrl)
            .setThumbnail(shinySpriteUrl)
            .addFields(
                { name: `Peso`, value: `${pokemonWeight} kg`, inline: true },
                { name: `Altura`, value: `${pokemonHeight} m`, inline: true },
                { name: `Tipos`, value: `${pokemonTypes.join(", ")}` }
            )
            .setTimestamp();

        await embeds.push(EmbedDefault);

        //Si no hay imagen shiny no se el segundo embed
        if (shinyArtworDefaultSpriteUrl) {
            await embeds.push(EmbedShiny);
        }

        return paginacion();

        async function paginacion() {
            let embedpaginas = null;
            let row = null;

            //Creacion boton salir para el menú
            let btn_salir = new ButtonBuilder()
                .setCustomId("exit")
                .setLabel("❌ Salir")
                .setStyle(ButtonStyle.Danger);

            //Si solo hay 1 embed enviamos el mensaje sin botones de navegacion
            if (embeds.length === 1) {
                row = new ActionRowBuilder().addComponents(btn_salir);

                embedpaginas = await interaction.channel
                    .send({
                        embeds: [embeds[0]],
                        components: [row]
                    })
                    .catch(() => {});

                //Si el numero de embeds es mayor a 1 ponemos los botones de paginacion
            } else {
                let btn_normal = new ButtonBuilder()
                    .setCustomId("normal")
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Normal");
                let btn_shiny = new ButtonBuilder()
                    .setCustomId("shiny")
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Shiny");

                row = new ActionRowBuilder().addComponents(btn_normal, btn_shiny, btn_salir);

                embedpaginas = await interaction.channel.send({
                    content: `**Navega con los _botones_ en el menú**`,
                    embeds: [embeds[0]],
                    components: [row]
                });
            }

            //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (Toffu)
            const collector = embedpaginas.createMessageComponentCollector({
                filter: (i) =>
                    i?.isButton() &&
                    i?.user &&
                    i?.user.id == interaction.user.id &&
                    i?.message.author.id == client.user.id,
                time: 100e3
            });

            collector.on("collect", async (action) => {
                switch (action?.customId) {
                    case "normal":
                        {
                            collector.resetTimer();

                            await embedpaginas
                                .edit({
                                    embeds: [embeds[0]],
                                    components: [embedpaginas.components[0]]
                                })
                                .catch(() => {});
                            await action?.deferUpdate();
                        }
                        break;
                    case "shiny":
                        {
                            collector.resetTimer();

                            await embedpaginas
                                .edit({
                                    embeds: [embeds[1]],
                                    components: [embedpaginas.components[0]]
                                })
                                .catch(() => {});
                            await action?.deferUpdate();
                        }
                        break;
                    case "exit":
                        {
                            collector.stop();
                        }
                        break;
                    default:
                        break;
                }
            });
            collector.on("end", async () => {
                //desactivamos botones y editamos el mensaje
                embedpaginas
                    .edit({
                        content: `${interaction.user?.username} buscó un pokemón`,
                        components: []
                    })
                    .catch(() => {});
                await interaction.deleteReply();
            });
        }
    }
};
