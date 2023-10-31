<h1 align="center">
    🔮 Discord.js Akinator 🔮
</h1>

A Discord.js v14 Module that allows you to Create an Akinator Command for Your Discord Bot within Seconds of Installation.

[![NPM](https://nodei.co/npm/discord.js-akinator.png)](https://npmjs.com/package/discord.js-akinator)

[![Downloads](https://img.shields.io/npm/dt/discord.js-akinator?logo=npm&style=flat-square)](https://npmjs.com/package/discord.js-akinator) [![Discord Server](https://img.shields.io/discord/667479986214666272?logo=discord&logoColor=white&style=flat-square)](https://discord.gg/P2g24jp)

## Features

- 🌎 <b>100+ Languages Supported!</b> | Lightning fast translation has been made possible by Google Translate and hard-coded mappings!

- ▶️ <b>Buttons!</b> | Don't want to type out responses to questions? This package gives you the option to use discord's buttons to easily click your answer of choice!

- 🎮 <b>Multiple Game Types!</b> | This package will allow you to choose whether Akinator will guess an Animal, Character or Object!

- 🙋 <b>Child Mode!</b> | Want to filter out NSFW questions? You can choose to enable Akinator's Child Mode to keep your games squeaky clean!

- ⚡️ <b>Quick & Easy Setup!</b> | This package was built with the intentions of working out-of-the-box. Only one parameter is required at least!

- 🤖 <b>Slash Command & Message Support!</b> | No matter how your bot receives its commands, you can simply pass in a `CommandInteraction` or `Message` and it will work!

## Install Package

Let's take a look at how you can install this package into your Discord Bot Project.

`npm i discord.js-akinator --save`

For versions 4.0.0 and above, you'll also need Discord.js v14. This can easily be installed with:

`npm i discord.js@14 --save`

For versions earlier than 4.0.0, you'll need Discord.js v13 instead. However it is recommended you update to patch bugs and security vulnerabilities, as well as get the newest features from this package!

`npm i discord.js@13 --save`

## Code Examples

### Initial Setup:
```js
const { Client, IntentsBitField } = require("discord.js");
const akinator = require("discord.js-akinator");
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.login("Discord Bot Token");

client.on("ready", () => {
    console.log("Bot is Online");
});

// Example options for Discord.js Akinator:

const language = "en"; // The Language of the Game
const childMode = false; // Whether to use Akinator's Child Mode
const gameType = "character"; // The Type of Akinator Game to Play. ("animal", "character" or "object")
const useButtons = true; // Whether to use Discord's Buttons
const embedColor = "#1F1E33"; // The Color of the Message Embeds
```
With Discord.js Akinator, you can choose whether you want to use a message, or a slash command as the input. Here's a quick example on how to do both!

### Using Discord's Slash Commands as Input:

```js
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return; // If the interaction is not a slash command, do nothing
    if (interaction.commandName === "akinator") { // If the user sends "/akinator"...
        akinator(interaction, {
            language: language, // Defaults to "en"
            childMode: childMode, // Defaults to "false"
            gameType: gameType, // Defaults to "character"
            useButtons: useButtons, // Defaults to "false"
            embedColor: embedColor // Defaults to "Random"
        });
    };
});
```

### Using a Message as Input:

```js
// ATTENTION: Make sure to enable the "Message Content" intent for your bot in the Discord Developer Portal!

const PREFIX = "!"; // Your bot's command prefix

client.on("messageCreate", async message => {
    if (message.content.startsWith(`${PREFIX}akinator`)) { // When the user types "!akinator"...
        akinator(message, {
            language: language, // Defaults to "en"
            childMode: childMode, // Defaults to "false"
            gameType: gameType, // Defaults to "character"
            useButtons: useButtons, // Defaults to "false"
            embedColor: embedColor // Defaults to "Random"
        });
    };
});
```

## Contributors

- [3061LRTAGSPKJMORMRT (Ashish#0540)](https://github.com/3061LRTAGSPKJMORMRT) (Error handling and writing much cleaner code)

- [ChaosArising (Josh_#9733)](https://github.com/ChaosArising) (Providing compatibility for Discord.js v13 in v3.0.0)

- ...and [many other people](https://github.com/WillTDA/Discord.js-Akinator/graphs/contributors) helping to make language translation more accurate, and so much more!

## Contact Us

- 👋 Need Help? [Join Our Discord Server](https://discord.gg/P2g24jp)!

- 👾 Found a Bug, or Inaccurate Translations? [Open an Issue](https://github.com/WillTDA/Discord.js-Akinator/issues), or Fork and [Submit a Pull Request](https://github.com/WillTDA/Discord.js-Akinator/pulls) on our [GitHub Repository](https://github.com/WillTDA/Discord.js-Akinator)!