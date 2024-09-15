const { IntentsBitField, Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { EpicFreeGames } = require("epic-free-games");
const cron = require("node-cron");
const dayjs = require("dayjs");
const superDjs = require("super-djs");
const deleteOldMsg = require("./deleteOldMsg");
const dotenv = require("dotenv");
dotenv.config();

const { NAME_BOT, EPICGAMES_CHANNEL_ID, TOKEN_DISCORD } = process.env;
const clientDC = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

clientDC.login(TOKEN_DISCORD);

const epicGamesFree = async (client) => {
    cron.schedule(
        "30 17 * * thu",
        async () => {
            // Delete old messages
            deleteOldMsg(clientDC, EPICGAMES_CHANNEL_ID);

            console.log(
                superDjs.colourText(
                    `(Es jueves (17:30) Envia embeds al canal: 🎮-free-epic-games (${new Date().toLocaleTimeString(
                        "es-ES",
                        {
                            timeZone: "Europe/Madrid"
                        }
                    )})`,
                    "green"
                )
            );

            const epicFreeGames = new EpicFreeGames({
                country: "ES",
                locale: "es-ES",
                includeAll: true
            });

            try {
                const res = await epicFreeGames.getGames();

                if (!res) {
                    const embedError = new EmbedBuilder()
                        .setTitle(`Ha ocurrido un error.`)
                        .setTimestamp()
                        .setFooter({
                            text: NAME_BOT,
                            iconURL: client?.user.displayAvatarURL()
                        })
                        .setColor("#ff0000");

                    await client?.channels.cache.get(EPICGAMES_CHANNEL_ID).send({
                        embeds: [embedError]
                    });
                    return;
                }

                const formatPrice = (num) => {
                    if (!num) return;
                    let str = num.toString().split(".");
                    str[0] = str[0].replace(/\B(?=(\d{2})+(?!\d))/g, ",");
                    return str.join(".");
                };

                const getImageUrl = (keyImages, type) => {
                    const image = keyImages.find((img) => img.type === type);
                    if (image && image.url) {
                        const encodedUrl = encodeURI(image.url);
                        return encodedUrl;
                    }
                    return null;
                };

                const buildEmbedForGame = async (game, isNextGame) => {
                    const imageUrl =
                        getImageUrl(game.keyImages, "OfferImageWide") ||
                        getImageUrl(game.keyImages, "Thumbnail");

                    const embed = new EmbedBuilder()
                        .setTitle(
                            `${
                                isNextGame
                                    ? `Disponible próximamente del **${dayjs()
                                          .add(7, "day")
                                          .format("DD/MM")}** al **${dayjs()
                                          .add(14, "day")
                                          .format("DD/MM")}** \n\n`
                                    : `Gratis hasta el **${dayjs()
                                          .add(7, "day")
                                          .format("DD/MM")} a las 17:00**\n\n`
                            } ${game.title}`
                        )
                        .setDescription(
                            `${game.description}\n\nhttps://store.epicgames.com/es-ES/p/${
                                game.urlSlug.includes("-")
                                    ? game.urlSlug
                                    : game.offerMappings[0]?.pageSlug
                            }`
                        )
                        .setThumbnail("https://peralstudio.com/images/epic-games.png")
                        .setImage(imageUrl || "https://peralstudio.com/images/epic-games.png") // Validar que la URL sea válida o usar imagen por defecto
                        .addFields(
                            {
                                name: "Precio Normal",
                                value: `${
                                    game.price?.totalPrice?.originalPrice === 0
                                        ? "Gratis"
                                        : `${formatPrice(game.price?.totalPrice?.originalPrice)}€`
                                }`,
                                inline: true
                            },
                            {
                                name: "Desarrolladora",
                                value: `${game.seller?.name}`,
                                inline: true
                            }
                        )
                        .setTimestamp()
                        .setFooter({
                            text: NAME_BOT,
                            iconURL: client?.user.displayAvatarURL()
                        })
                        .setColor(isNextGame ? "#FFA500" : "#27963f");

                    return embed;
                };

                // Enviar embeds de currentGames
                const currentGameEmbeds = await Promise.all(
                    res.currentGames.map((game) => buildEmbedForGame(game, false))
                );

                if (currentGameEmbeds.length > 0) {
                    await client?.channels.cache
                        .get(EPICGAMES_CHANNEL_ID)
                        .send({ embeds: currentGameEmbeds });
                }

                // Enviar embeds de nextGames
                const nextGameEmbeds = await Promise.all(
                    res.nextGames.map((game) => buildEmbedForGame(game, true))
                );

                if (nextGameEmbeds.length > 0) {
                    await client?.channels.cache
                        .get(EPICGAMES_CHANNEL_ID)
                        .send({ embeds: nextGameEmbeds });
                }
            } catch (err) {
                console.log(err);
            }
        },
        {
            timezone: "Europe/Madrid"
        }
    );
};

module.exports = epicGamesFree;
