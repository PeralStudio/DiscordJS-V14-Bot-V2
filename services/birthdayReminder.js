const { EmbedBuilder } = require("discord.js");
const bdSchema = require("../schemas/birthdaySchema");
const cron = require("node-cron");
require("dotenv").config();

const birthdaysReminder = (client) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    cron.schedule(
        "1 0 * * *",
        async () => {
            const zoneId = "Europe/Madrid";
            const today = new Date().toLocaleDateString("es-ES", { timeZone: zoneId });
            const todayMonth = today.split("/")[1];
            const todayDay = today.split("/")[0];

            console.log(today);

            const usersWithBirthdaysToday = await bdSchema.find({
                Month: todayMonth,
                Day: todayDay
            });

            usersWithBirthdaysToday.forEach(async (user) => {
                const embed = new EmbedBuilder()
                    .setTitle(guild.name)
                    .setThumbnail(guild.iconURL())
                    .setDescription(`¡Felicidades por tus ${user.Age} años <@${user.UserID}>!`)
                    .addFields({
                        name: "\u200B",
                        value: `🎉 El día de tu cumpleaños es siempre un día mágico, disfrútalo…. ¡Y muchas felicidades! 🎉`
                    })
                    .setImage("https://www.funimada.com/assets/images/cards/big/bday-261.gif")
                    .setColor("#059F03")
                    .setTimestamp()
                    .setFooter({ text: "🎂🎂🎂🎉🎉🎂🎂🎂" });

                await client.users.fetch(user.UserID).then((user) => {
                    user.send({ embeds: [embed] });
                });
            });
        },
        {
            timezone: "Europe/Madrid"
        }
    );
};

module.exports = birthdaysReminder;
