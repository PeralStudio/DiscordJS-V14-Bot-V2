const client = require("../../index");
const colors = require("colors");
const superDjs = require("super-djs");

module.exports = {
    name: "ready.js",
};

client.once("ready", async () => {
    console.log(
        superDjs.colourText(
            `
╔═════════════════════════════════════════════════════╗
║                                                     ║
║     Bot conectado como ${client.user.tag}!            ║
║     (${new Date().toLocaleTimeString("es-ES", {
                timeZone: "Europe/Madrid",
            })})                                      ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`,
            "green"
        )
    );
});
