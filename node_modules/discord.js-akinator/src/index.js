const Discord = require("discord.js")
const { Aki } = require("aki-api");
const fs = require("fs");
const translate = require("./translate");
const awaitInput = require("./input");
const attemptingGuess = new Set();

// this simply gets the user's reply from a button interaction (that is, if the user has chosen to enable buttons)
function getButtonReply(interaction) {
    interaction = interaction.customId;
    if (interaction === "✅") return "y"; // yes
    else if (interaction === "❌") return "n"; //no
    else if (interaction === "❓") return "i"; // don't know
    else if (interaction === "👍") return "p"; // probably
    else if (interaction === "👎") return "pn"; // probably not
    else if (interaction === "⏪") return "b"; // back
    else if (interaction === "🛑") return "s"; // stop game
    else return null;
};

/**
    * Play a Game of Akinator.
    * 
    * Simply pass in the Discord `Message` or `CommandInteraction` sent by the user to this function to start the game.
    * 
    * __Game Options__
    * 
    * - `language` - The Language of the Game.
    * - `childMode` - Whether to use Akinator's Child Mode.
    * - `gameType` - The Type of Akinator Game to Play. (`animal`, `character` or `object`)
    * - `useButtons` - Whether to use Discord's Buttons.
    * - `embedColor` - The Color of the Message Embeds.
    * 
    * @param {Discord.Message | Discord.CommandInteraction} input The Message or Slash Command Sent by the User.
    * @param {object} options The Options for the Game.
    * @param {string} [options.language="en"] The Language of the Game. Defaults to "en".
    * @param {boolean} [options.childMode=false] Whether to use Akinator's Child Mode. Defaults to "false".
    * @param {"character" | "animal" | "object"} [options.gameType="character"] The Type of Akinator Game to Play. Defaults to "character".
    * @param {boolean} [options.useButtons=false] Whether to use Discord's Buttons. Defaults to "false".
    * @param {Discord.ColorResolvable} [options.embedColor="Random"] The Color of the Message Embeds. Defaults to "RANDOM".
    * @returns {Promise<void>} Discord.js Akinator Game
    */

module.exports = async function (input, options = {}) {
    // check discord.js version
    if (Discord.version.split(".")[0] < 14) return console.log("Discord.js Akinator Error: Discord.js v14 or Higher is Required.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");

    let inputData = {};
    try {
        // configuring game options if not specified
        options.language = options.language || "en";
        options.childMode = options.childMode || false;
        options.gameType = options.gameType || "character";
        options.useButtons = options.useButtons || false;
        options.embedColor = Discord.resolveColor(options.embedColor || "Random");

        options.language = options.language.toLowerCase();
        options.gameType = options.gameType.toLowerCase();

        // error handling
        if (!input) return console.log("Discord.js Akinator Error: Message or CommandInteraction was not Provided.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");
        if (!input.client) return console.log("Discord.js Akinator Error: Message or CommandInteration Provided was Invalid.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");
        if (!input.guild) return console.log("Discord.js Akinator Error: Cannot be used in Direct Messages.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");
        if (!fs.existsSync(`${__dirname}/translations/${options.language}.json`)) return console.log(`Discord.js Akinator Error: Language "${options.language}" Not Found. Examples are: "en" or "fr" or "es".\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'`);
        if (!["animal", "character", "object"].includes(options.gameType)) return console.log(`Discord.js Akinator Error: Game Type "${options.gameType}" Not Found. Choose from: "animal", "character" or "object".\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'`);

        try {
            inputData.client = input.client,
                inputData.guild = input.guild,
                inputData.author = input.author ? input.author : input.user,
                inputData.channel = input.channel
        } catch {
            return console.log("Discord.js Akinator Error: Failed to Parse Input for Use.\nJoin Our Discord Server for Support at 'https://discord.gg/P2g24jp'");
        }

        //auto-resetting 
        attemptingGuess.delete(inputData.guild.id);

        // defining for easy use
        let usertag = inputData.author.tag;
        let avatar = inputData.author.displayAvatarURL({ dynamic: true });

        // get translation object for the language
        let translations = require(`${__dirname}/translations/${options.language}.json`);

        let startingEmbed = {
            title: `${translations.startingGame}`,
            description: `**${translations.startingGameDesc}**`,
            color: options.embedColor,
            author: { name: usertag, icon_url: avatar }
        }

        let startingMessage;

        if ((input.commandName !== undefined) && (!input.replied) && (!input.deferred)) { // check if it's a slash command and hasn't been replied or deferred
            await input.deferReply();
            startingMessage = await input.editReply({ embeds: [startingEmbed] })
        } else {
            if (input.commandName !== undefined) { //check if it's a slash command
                startingMessage = await input.editReply({ embeds: [startingEmbed] })
            }
            else { startingMessage = await input.channel.send({ embeds: [startingEmbed] }) } // else, the input is a message
        }

        // starts the game
        let gameTypeRegion = options.gameType == "animal" ? "en_animals" : options.gameType == "character" ? "en" : "en_objects";
        let aki = new Aki({ region: gameTypeRegion, childMode: options.childMode });
        await aki.start();

        let notFinished = true;
        let stepsSinceLastGuess = 0;
        let hasGuessed = false;

        let noResEmbed = {
            title: translations.gameEnded,
            description: `**${inputData.author.username}, ${translations.gameEndedDesc}**`,
            color: options.embedColor,
            author: { name: usertag, icon_url: avatar }
        }

        let akiEmbed = {
            title: `${translations.question} ${aki.currentStep + 1}`,
            description: `**${translations.progress}: 0%\n${await translate(aki.question, options.language)}**`,
            color: options.embedColor,
            fields: [],
            author: { name: usertag, icon_url: avatar }
        }

        if (!options.useButtons) {
            akiEmbed.footer = { text: translations.stopTip }
            akiEmbed.fields.push({ name: translations.pleaseType, value: `**Y** or **${translations.yes}**\n**N** or **${translations.no}**\n**I** or **IDK**\n**P** or **${translations.probably}**\n**PN** or **${translations.probablyNot}**\n**B** or **${translations.back}**` })
        }

        let akiMessage;

        if (input.commandName !== undefined) { //check if it's a slash command
            akiMessage = await input.editReply({ embeds: [akiEmbed] })
        } else { akiMessage = await startingMessage.edit({ embeds: [akiEmbed] }); } // else, the input is a message

        let updatedAkiEmbed = akiMessage.embeds[0];

        // repeat while the game is not finished
        while (notFinished) {
            if (!notFinished) return;

            stepsSinceLastGuess = stepsSinceLastGuess + 1

            if (((aki.progress >= 95 && (stepsSinceLastGuess >= 10 || hasGuessed == false)) || aki.currentStep >= 78) && (!attemptingGuess.has(inputData.guild.id))) {
                attemptingGuess.add(inputData.guild.id)
                await aki.win();

                stepsSinceLastGuess = 0;
                hasGuessed = true;

                let guessEmbed = {
                    title: `${await translate(`I'm ${Math.round(aki.progress)}% sure your ${options.gameType} is...`, options.language)}`,
                    description: `**${aki.answers[0].name}**\n${await translate(aki.answers[0].description, options.language)}\n\n${options.gameType == "animal" ? translations.isThisYourAnimal : options.gameType == "character" ? translations.isThisYourCharacter : translations.isThisYourObject} ${!options.useButtons ? `**(Type Y/${translations.yes} or N/${translations.no})**` : ""}`,
                    color: options.embedColor,
                    image: { url: aki.answers[0].absolute_picture_path },
                    author: { name: usertag, icon_url: avatar },
                    fields: [
                        { name: translations.ranking, value: `**#${aki.answers[0].ranking}**`, inline: true },
                        { name: translations.noOfQuestions, value: `**${aki.currentStep}**`, inline: true }
                    ],
                }

                await akiMessage.edit({ embeds: [guessEmbed] });
                akiMessage.embeds[0] = guessEmbed;

                await awaitInput(options.useButtons, inputData, akiMessage, true, translations, options.language)
                    .then(async response => {
                        if (response === null) {
                            notFinished = false;
                            akiMessage.edit({ embeds: [noResEmbed], components: [] })
                            return;
                        }
                        if (options.useButtons !== false) await response.deferUpdate()
                        let reply = getButtonReply(response) || response
                        const guessAnswer = reply.toLowerCase();

                        attemptingGuess.delete(inputData.guild.id)

                        // if they answered yes
                        if (guessAnswer == "y" || guessAnswer == translations.yes.toLowerCase()) {
                            let finishedGameCorrect = {
                                title: translations.wellPlayed,
                                description: `**${inputData.author.username}, ${translations.guessedRightOneMoreTime}**`,
                                color: options.embedColor,
                                author: { name: usertag, icon_url: avatar },
                                fields: [
                                    { name: translations[options.gameType], value: `**${aki.answers[0].name}**`, inline: true },
                                    { name: translations.ranking, value: `**#${aki.answers[0].ranking}**`, inline: true },
                                    { name: translations.noOfQuestions, value: `**${aki.currentStep}**`, inline: true }
                                ]
                            }

                            if (options.useButtons) await response.editReply({ embeds: [finishedGameCorrect], components: [] })
                            else await akiMessage.edit({ embeds: [finishedGameCorrect], components: [] })
                            notFinished = false;
                            return;

                            // otherwise
                        } else if (guessAnswer == "n" || guessAnswer == translations.no.toLowerCase()) {
                            if (aki.currentStep >= 78) {
                                let finishedGameDefeated = {
                                    title: "Well Played!",
                                    description: `**${inputData.author.username}, ${translations.defeated}**`,
                                    color: options.embedColor,
                                    author: { name: usertag, icon_url: avatar }
                                }

                                if (options.useButtons) await response.editReply({ embeds: [finishedGameDefeated], components: [] })
                                else await akiMessage.edit({ embeds: [finishedGameDefeated], components: [] })
                                notFinished = false;
                            } else {
                                if (options.useButtons) await response.editReply({ embeds: [guessEmbed], components: [] })
                                else await akiMessage.edit({ embeds: [guessEmbed], components: [] })
                                aki.progress = 50
                            }
                        }
                    });
            }

            if (!notFinished) return;

            if (updatedAkiEmbed !== akiMessage.embeds[0]) {
                updatedAkiEmbed = {
                    title: `${translations.question} ${aki.currentStep + 1}`,
                    description: `**${translations.progress}: ${Math.round(aki.progress)}%\n${await translate(aki.question, options.language)}**`,
                    color: options.embedColor,
                    fields: [],
                    author: { name: usertag, icon_url: avatar }
                }

                if (!options.useButtons) {
                    updatedAkiEmbed.footer = { text: translations.stopTip }
                    updatedAkiEmbed.fields.push({ name: translations.pleaseType, value: `**Y** or **${translations.yes}**\n**N** or **${translations.no}**\n**I** or **IDK**\n**P** or **${translations.probably}**\n**PN** or **${translations.probablyNot}**\n**B** or **${translations.back}**` })
                }
                await akiMessage.edit({ embeds: [updatedAkiEmbed] })
                akiMessage.embeds[0] = updatedAkiEmbed
            }

            await awaitInput(options.useButtons, inputData, akiMessage, false, translations, options.language)
                .then(async response => {
                    if (response === null) {
                        await aki.win()
                        notFinished = false;
                        return akiMessage.edit({ embeds: [noResEmbed], components: [] })
                    }
                    if (options.useButtons !== false) await response.deferUpdate()
                    let reply = getButtonReply(response) || response
                    const answer = reply.toLowerCase();

                    // assign points for the possible answers given
                    const answers = {
                        "y": 0,
                        "yes": 0,
                        "n": 1,
                        "no": 1,
                        "i": 2,
                        "idk": 2,
                        "dont know": 2,
                        "don't know": 2,
                        "i": 2,
                        "p": 3,
                        "probably": 3,
                        "pn": 4,
                        "probably not": 4,
                    }

                    let thinkingEmbed = {
                        title: `${translations.question} ${aki.currentStep + 1}`,
                        description: `**${translations.progress}: ${Math.round(aki.progress)}%\n${await translate(aki.question, options.language)}**`,
                        color: options.embedColor,
                        fields: [],
                        author: { name: usertag, icon_url: avatar },
                        footer: { text: translations.thinking }
                    }

                    if (!options.useButtons) thinkingEmbed.fields.push({ name: translations.pleaseType, value: `**Y** or **${translations.yes}**\n**N** or **${translations.no}**\n**I** or **IDK**\n**P** or **${translations.probably}**\n**PN** or **${translations.probablyNot}**\n**B** or **${translations.back}**` })

                    if (options.useButtons) await response.editReply({ embeds: [thinkingEmbed], components: [] })
                    else await akiMessage.edit({ embeds: [thinkingEmbed], components: [] })
                    akiMessage.embeds[0] = thinkingEmbed

                    if (answer == "b" || answer == translations.back.toLowerCase()) {
                        if (aki.currentStep >= 1) {
                            await aki.back();
                        }

                        // stop the game if the user selected to stop
                    } else if (answer == "s" || answer == translations.stop.toLowerCase()) {
                        let stopEmbed = {
                            title: translations.gameEnded,
                            description: `**${inputData.author.username}, ${translations.gameForceEnd}**`,
                            color: options.embedColor,
                            author: { name: usertag, icon_url: avatar }
                        }

                        await aki.win()
                        await akiMessage.edit({ embeds: [stopEmbed], components: [] })
                        notFinished = false;
                    } else {
                        await aki.step(answers[answer]);
                    }

                    if (!notFinished) return;
                });
        }
    } catch (e) {
        // log any errors that come
        attemptingGuess.delete(inputData.guild.id)
        if (e == "DiscordAPIError: Unknown Message") return;
        console.log("Discord.js Akinator Error:")
        console.log(e);
    }
};