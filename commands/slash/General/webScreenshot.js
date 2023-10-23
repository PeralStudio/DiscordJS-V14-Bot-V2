const { EmbedBuilder, WebhookClient, AttachmentBuilder } = require("discord.js");
const puppeteer = require("puppeteer");
require("dotenv").config();

const webhook = new WebhookClient({
    url: process.env.WEBHOOK_ERRORESBOT
});

module.exports = {
    name: "captura-web",
    description: "Hacer una captura de una pagina web",
    type: 1,
    options: [
        {
            type: 3,
            name: "web",
            description: "Web a capturar.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const web = interaction.options.getString("web");

        await interaction.deferReply({ ephemeral: true });

        try {
            const browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
            });
            const page = await browser.newPage();
            await page.goto(web);
            await page.setViewport({ width: 1920, height: 1080 });
            await page.waitForTimeout(2000);

            const screenshot = await page.screenshot();
            await browser.close();

            const buffer = Buffer.from(screenshot, "base64");
            const attachment = new AttachmentBuilder(buffer, { name: "screenshot-web.png" });

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setImage("attachment://screenshot-web.png")
                .setColor("Random")
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            webhook.send({
                content: `Ha ocurrido un error : ${error}`
            });
        }
    }
};
