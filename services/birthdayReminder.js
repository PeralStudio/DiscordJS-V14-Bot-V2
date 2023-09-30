const { WebhookClient, EmbedBuilder } = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");
dotenv.config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_GENERAL_CHANNEL
});

const birthdaysReminder = () => {
    // YO
    cron.schedule(
        "0 15 7 8 *",
        () => {
            const embed = new EmbedBuilder()
                .setDescription(`🎂🎉 ¡¡Felicidades <@209338137346834433>!! 🎂🎉`)
                .setImage("https://www.funimada.com/assets/images/cards/big/bday-261.gif")
                .setColor("#059F03")
                .setTimestamp()
                .setFooter({ text: "🎂🎂🎂🎉🎉🎂🎂🎂" });

            webhook.send({ embeds: [embed] });
        },
        {
            timezone: "Europe/Madrid"
        }
    );

    // JOFRE
    cron.schedule(
        "0 15 21 3 *",
        () => {
            const embed = new EmbedBuilder()
                .setDescription(`🎂🎉 ¡¡Felicidades <@179686774895935489>!! 🎂🎉`)
                .setImage("https://www.funimada.com/assets/images/cards/big/bday-261.gif")
                .setColor("#059F03")
                .setTimestamp()
                .setFooter({ text: "🎂🎂🎂🎉🎉🎂🎂🎂" });

            webhook.send({ embeds: [embed] });
        },
        {
            timezone: "Europe/Madrid"
        }
    );

    // DANIEL
    cron.schedule(
        "0 15 15 11 *",
        () => {
            const embed = new EmbedBuilder()
                .setDescription(`🎂🎉 ¡¡Felicidades <@298585122519908364>!! 🎂🎉`)
                .setImage("https://www.funimada.com/assets/images/cards/big/bday-261.gif")
                .setColor("#059F03")
                .setTimestamp()
                .setFooter({ text: "🎂🎂🎂🎉🎉🎂🎂🎂" });

            webhook.send({ embeds: [embed] });
        },
        {
            timezone: "Europe/Madrid"
        }
    );

    // HUGO
    cron.schedule(
        "0 15 22 4 *",
        () => {
            const embed = new EmbedBuilder()
                .setDescription(`🎂🎉 ¡¡Felicidades <@254135921144758273>!! 🎂🎉`)
                .setImage("https://www.funimada.com/assets/images/cards/big/bday-261.gif")
                .setColor("#059F03")
                .setTimestamp()
                .setFooter({ text: "🎂🎂🎂🎉🎉🎂🎂🎂" });

            webhook.send({ embeds: [embed] });
        },
        {
            timezone: "Europe/Madrid"
        }
    );
};

module.exports = birthdaysReminder;
