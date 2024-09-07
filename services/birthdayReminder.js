const { EmbedBuilder } = require("discord.js");
const bdSchema = require("../schemas/birthdaySchema");
const cron = require("node-cron");
require("dotenv").config();

const birthdaysReminder = (client) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    if (!guild) {
        console.error("El GUILD_ID no es válido o el bot no está en el servidor especificado.");
        return;
    }

    cron.schedule(
        "1 0 * * *",
        async () => {
            const zoneId = "Europe/Madrid";
            const today = new Date().toLocaleDateString("es-ES", { timeZone: zoneId });
            const todayMonth = today.split("/")[1];
            const todayDay = today.split("/")[0];

            try {
                const usersWithBirthdaysToday = await bdSchema.find({
                    Month: todayMonth,
                    Day: todayDay
                });

                if (!usersWithBirthdaysToday.length) {
                    console.log("No hay cumpleaños hoy.");
                    return;
                }

                usersWithBirthdaysToday.forEach(async (user) => {
                    const embed = new EmbedBuilder()
                        .setTitle(guild.name || "Servidor")
                        .setThumbnail(guild.iconURL() || "")
                        .setDescription(`¡Felicidades por tus ${user.Age} años <@${user.UserID}>!`)
                        .addFields({
                            name: "\u200B",
                            value: `🎉 El día de tu cumpleaños es siempre un día mágico, disfrútalo…. ¡Y muchas felicidades! 🎉`
                        })
                        .setImage("https://www.funimada.com/assets/images/cards/big/bday-261.gif")
                        .setColor("#059F03")
                        .setTimestamp()
                        .setFooter({ text: "🎂🎂🎂🎉🎉🎂🎂🎂" });

                    try {
                        const discordUser = await client.users.fetch(user.UserID);
                        if (discordUser) {
                            await discordUser.send({ embeds: [embed] });
                        } else {
                            console.error(`No se encontró el usuario con ID: ${user.UserID}`);
                        }
                    } catch (error) {
                        console.error(
                            `Error al enviar mensaje al usuario con ID: ${user.UserID}`,
                            error
                        );
                    }
                });
            } catch (error) {
                console.error("Error al buscar usuarios con cumpleaños hoy:", error);
            }
        },
        {
            timezone: "Europe/Madrid"
        }
    );
};

module.exports = birthdaysReminder;
