const { EmbedBuilder } = require("discord.js");
const { pagination, TypesButtons, StylesButton } = require("@devraelfreeze/discordjs-pagination");
require("dotenv").config();

module.exports = {
    name: "help",
    description: "Lista de comandos disponibles.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const embed = new EmbedBuilder()
            .setColor("#C28F2C")
            // .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`COMANDOS DISPONIBLES *${client.user.username.toUpperCase()}* \n`)
            .addFields(
                {
                    name: `*${process.env.PREFIX}play + canción*`,
                    value: "`Reproduce una canción.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}lol + Invocador*`,
                    value: "`Información Invocador.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}lol-tierlist*`,
                    value: "`Tierlist Campeones.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}lolparche*`,
                    value: "`Notas parche Lol`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}akinator*`,
                    value: "`Jugar a Akinator.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}juegos*`,
                    value: "`Varios juegos disponibles.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}fakeyou + personaje*`,
                    value: "`Tts con voces de personajes.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}chatgpt + texto*`,
                    value: "`Consulta a Chat GPT-3.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}sonidos*`,
                    value: "`Efectos de Sonido.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}carteleracine*`,
                    value: "`Cartelera de cine.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}meme*`,
                    value: "`Meme random reddit.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}google*`,
                    value: "`Búsqueda google`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}yt + texto*`,
                    value: "`Buscar video youtube.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}asci + texto*`,
                    value: "`Texto a ASCII.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}avatar + @usuario*`,
                    value: "`Avatar de un usuario.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}encuesta*`,
                    value: "`Crear encuesta.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}nivel + @usuario*`,
                    value: "`Ver tu nivel.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}actividad*`,
                    value: "`Iniciar una actividad.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}qr*`,
                    value: "`Crear codigo QR.`",
                    inline: true,
                },
                // {
                //     name: `*${process.env.PREFIX}tweet*`,
                //     value: "`Crear Tweet.`",
                //     inline: true,
                // },
                {
                    name: `*${process.env.PREFIX}playstore + texto*`,
                    value: "`Buscar App.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}github + @usuario*`,
                    value: "`Github de un usuario.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}emoji-list*`,
                    value: "`Emojis disponibles Servidor.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}tiempo + ciudad*`,
                    value: "`Información del tiempo.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}play-radio + emisora*`,
                    value: "`Reproducir emisora radio.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}stop-radio*`,
                    value: "`Detener radio.`",
                    inline: true,
                }
            )
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });

        const embed1 = new EmbedBuilder()
            .setColor("#C28F2C")
            // .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`COMANDOS DISPONIBLES *${client.user.username.toUpperCase()}* \n`)
            .addFields(
                {
                    name: `*${process.env.PREFIX}texto-doble + texto*`,
                    value: "`Crear texto doble.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}usuario-info + @usuario*`,
                    value: "`Información sobre un usuario.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}playlistyt + ID Canal*`,
                    value: "`Playlist de youtube.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}bigtext + texto*`,
                    value: "`Texto grande con numeros y letras.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}elrellano + página*`,
                    value: "`Vídeos elrellano.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}arder + @usuario*`,
                    value: "`Ardiendo en pasión.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}morse + texto*`,
                    value: "`Convertir texto a morse.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}tts + texto*`,
                    value: "`Texto a voz.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}serverinfo*`,
                    value: "`Información del servidor.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}traducir + texto*`,
                    value: "`Traducir texto a Ingles.`",
                    inline: true,
                },
                // {
                //     name: `*${process.env.PREFIX}corona + país*`,
                //     value: "`Información sobre el coronavirus.`",
                //     inline: true,
                // },
                {
                    name: `*${process.env.PREFIX}help*`,
                    value: "`Mostrar Comandos.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}bot-info*`,
                    value: "`Info del bot.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}ping*`,
                    value: "`Ping del bot.`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}enviarmd + usuario*`,
                    value: "`Enviar mensajes privados. (Admin/Mods)`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}borrar + nº*`,
                    value: "`Borrar mensajes. (Admin/Mods)`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}email*`,
                    value: "`Enviar email. (Admin)`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}crear-canal*`,
                    value: "`Crear canal. (Admin)`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}borrar-canal*`,
                    value: "`Borrar canal. (Admin)`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}crear-backup*`,
                    value: "`Crear Backup. (Admin)`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}info-backup*`,
                    value: "`Info Backup. (Admin)`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}list-backup*`,
                    value: "`Listar Backups. (Admin)`",
                    inline: true,
                },
                {
                    name: `*${process.env.PREFIX}delete-backup*`,
                    value: "`Borrar Backup. (Admin)`",
                    inline: true,
                }
            )
            .setTimestamp()
            .setFooter({
                text: process.env.NAME_BOT,
                iconURL: client.user.displayAvatarURL(),
            });

        // await interaction.reply({ embeds: [embed] });

        const embeds = [embed, embed1];

        await pagination({
            interaction: interaction,
            embeds: embeds, // Array of embeds objects
            author: interaction.member.user,
            time: 120000, // miliseconds for timeout
            fastSkip: false,
            disableButtons: true,
            pageTravel: false,
            /** Enable buttons pagination system only for member with ID: 123456789 */
            // customFilter: (interaction) => {
            //     return interaction.member.user.id === "123456789";
            // },
            buttons: [
                {
                    value: TypesButtons.previous,
                    label: "⬅️ Anterior",
                    style: StylesButton.Success,
                    emoji: null,
                },
                {
                    value: TypesButtons.next,
                    label: "Siguiente ➡️",
                    style: StylesButton.Success,
                    emoji: null,
                },
            ],
        });
    },
};
