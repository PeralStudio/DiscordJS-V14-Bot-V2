const { EmbedBuilder } = require("discord.js");
const { pagination, ButtonTypes, ButtonStyles } = require("@devraelfreeze/discordjs-pagination");
require("dotenv").config();

module.exports = {
    name: "help",
    description: "Lista de comandos disponibles.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        // Función para generar campos
        const generateFields = (commands) => {
            return commands.map((cmd) => ({
                name: `*${process.env.PREFIX}${cmd.name}*`,
                value: `\`${cmd.description}\``,
                inline: true
            }));
        };

        const generalCommands = [
            { name: "lol + Invocador", description: "Información Invocador." },
            { name: "lol-history + Invocador#tag", description: "Últimas 5 partidas Invocador." },
            { name: "lolparche", description: "Notas parche Lol" },
            { name: "lol-status", description: "Estado servicio de lol." },
            { name: "cumpleaños", description: "Agrega tu cumpleaños para felicitaciones." },
            { name: "mi-cumpleaños", description: "Información de tu cumpleaños." },
            { name: "set-cumpleaños", description: "Modifica la fecha de tu cumpleaños" },
            { name: "recordatorio", description: "Crear recordatorio" },
            { name: "akinator", description: "Jugar a Akinator." },
            { name: "juegos", description: "Varios juegos disponibles." },
            { name: "fakeyou + personaje", description: "Tts con voces de personajes." },
            { name: "play + canción", description: "Reproduce una canción." },
            { name: "sonidos", description: "Efectos de Sonido." },
            { name: "carteleracine", description: "Cartelera de cine." },
            { name: "google", description: "Búsqueda google" },
            { name: "yt + texto", description: "Buscar video youtube." },
            { name: "avatar + @usuario", description: "Avatar de un usuario." },
            { name: "encuesta", description: "Crear encuesta." },
            { name: "nivel + @usuario", description: "Ver tu nivel." },
            { name: "qr", description: "Crear codigo QR." },
            { name: "playstore + texto", description: "Buscar App." },
            { name: "github + @usuario", description: "Github de un usuario." },
            { name: "tiempo + ciudad", description: "Información del tiempo." },
            { name: "play-radio + emisora", description: "Reproducir emisora radio." }
        ];

        const additionalCommands = [
            { name: "rajoy", description: "Audio & Frase random Rajoy" },
            { name: "pelicula + título película", description: "Información pelicula" },
            { name: "stop-radio", description: "Detener radio." },
            { name: "texto-doble + texto", description: "Crear texto doble." },
            { name: "usuario-info + @usuario", description: "Información sobre un usuario." },
            { name: "playlistyt + ID Canal", description: "Playlist de youtube." },
            { name: "actividad", description: "Iniciar una actividad." },
            { name: "asci + texto", description: "Texto a ASCII." },
            { name: "pokemon + ID", description: "Información sobre un pokemon." },
            { name: "bigtext + texto", description: "Texto grande con numeros y letras." },
            { name: "elrellano + página", description: "Vídeos elrellano." },
            { name: "arder + @usuario", description: "Ardiendo en pasión." },
            { name: "emoji-list", description: "Emojis disponibles Servidor." },
            { name: "morse + texto", description: "Convertir texto a morse." },
            { name: "tts + texto", description: "Texto a voz." },
            { name: "meme", description: "Meme random reddit." },
            { name: "lol-tierlist", description: "Tierlist Campeones." },
            { name: "serverinfo", description: "Información del servidor." },
            { name: "traducir + texto", description: "Traducir texto a Ingles." },
            { name: "help", description: "Mostrar Comandos." },
            { name: "bot-info", description: "Info del bot." },
            { name: "ping", description: "Ping del bot." },
            { name: "eval", description: "Evaluar codigo JavaScript. (Admin/Mods)" },
            { name: "borrar + nº", description: "Borrar mensajes. (Admin/Mods)" }
        ];

        const adminCommands = [
            { name: "nsn-ultimo-podcast", description: "Nadie Sabe Nada ultimo podcast. (Admin)" },
            { name: "suno-crear", description: "Genera una canción. (Admin)" },
            { name: "bbdd", description: "Ver colecciones BBDD. (Admin)" },
            { name: "bbdd + [colección]", description: "Ver una colección. (Admin)" },
            { name: "email", description: "Enviar email. (Admin)" },
            { name: "ver-cumpleaños", description: "Ver lista de cumpleaños en BBDD (Admin)" },
            { name: "crear-canal", description: "Crear canal. (Admin)" },
            { name: "borrar-canal", description: "Borrar canal. (Admin)" },
            { name: "terminal", description: "Terminal. (Admin)" },
            { name: "crear-backup", description: "Crear Backup. (Admin)" },
            { name: "info-backup", description: "Info Backup. (Admin)" },
            { name: "list-backup", description: "Listar Backups. (Admin)" },
            { name: "delete-backup", description: "Borrar Backup. (Admin)" },
            { name: "bot-avatar", description: "Cambiar avatar bot. (Admin)" },
            { name: "enviarmd + usuario", description: "Enviar mensajes privados. (Admin)" }
        ];

        // Embeds
        const embedGeneral = new EmbedBuilder()
            .setTitle(`COMANDOS DISPONIBLES *${client.user.username.toUpperCase()}* \n`)
            .setColor("#C28F2C")
            .addFields(generateFields(generalCommands));

        const embedAdditional = new EmbedBuilder()
            .setTitle(`COMANDOS DISPONIBLES *${client.user.username.toUpperCase()}* \n`)
            .setColor("#C28F2C")
            .addFields(generateFields(additionalCommands));

        const embedAdmin =
            interaction.user.id === process.env.ID_OWNER
                ? new EmbedBuilder()
                      .setTitle(
                          `COMANDOS DISPONIBLES ADMIN **${client.user.username.toUpperCase()}** \n`
                      )
                      .setColor("#C28F2C")
                      .addFields(generateFields(adminCommands))
                : null;

        // Footer y timestamp
        [embedGeneral, embedAdditional, embedAdmin].forEach((embed) => {
            if (embed) {
                embed
                    .setFooter({
                        text: process.env.NAME_BOT,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp();
            }
        });

        const embeds = embedAdmin
            ? [embedGeneral, embedAdditional, embedAdmin]
            : [embedGeneral, embedAdditional];

        await pagination({
            interaction,
            embeds,
            author: interaction.member.user,
            time: 120000,
            fastSkip: false,
            disableButtons: true,
            pageTravel: false,
            buttons: [
                {
                    value: ButtonTypes.previous,
                    label: "⬅️ Anterior",
                    style: ButtonStyles.Success
                },
                {
                    value: ButtonTypes.next,
                    label: "Siguiente ➡️",
                    style: ButtonStyles.Success
                }
            ]
        });
    }
};
