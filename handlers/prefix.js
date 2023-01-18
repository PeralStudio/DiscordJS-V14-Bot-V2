const fs = require("fs");
const colors = require("colors");
const superDjs = require("super-djs");

module.exports = (client, config) => {
    console.log(superDjs.colourText("------------------>> Prefix Handler:", "blue"));

    fs.readdirSync("./commands/prefix/").forEach((dir) => {
        const commands = fs
            .readdirSync(`./commands/prefix/${dir}`)
            .filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/prefix/${dir}/${file}`);
            if (pull.config.name) {
                client.prefix_commands.set(pull.config.name, pull);
                console.log(
                    superDjs.colourText(
                        `[HANDLER - PREFIX] Loaded a file: ${pull.config.name} (#${client.prefix_commands.size})`,
                        "green"
                    )
                );
            } else {
                console.log(
                    superDjs.colourText(
                        `[HANDLER - PREFIX] Couldn't load the file ${file}, missing module name value.`,
                        "red"
                    )
                );
                continue;
            }
        }
    });
};
