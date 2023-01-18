const client = require("../../index");
const colors = require("colors");

module.exports = {
    name: "ready.js",
};

client.once("ready", async () => {
    console.log(
        `
╔═════════════════════════════════════════════════════╗
║                                                     ║
║     Bot conectado como ${client.user.tag}!            ║
║     (${new Date().toLocaleTimeString("es-ES", {
            timeZone: "Europe/Madrid",
        })})                                      ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.rainbow
    );
});
