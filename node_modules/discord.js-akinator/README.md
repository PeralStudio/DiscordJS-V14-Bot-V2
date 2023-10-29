<h1 align="center">
    🔮 Discord.js Akinator 🔮
</h1>

<center style="margin-bottom:1rem;">A Discord.js v14 module that allows you to create an Akinator command for your discord bot in a matter of seconds.</center>

[![NPM](https://nodei.co/npm/discord.js-akinator.png)](https://npmjs.com/package/discord.js-akinator)

[![Downloads](https://img.shields.io/npm/dt/discord.js-akinator?logo=npm&style=flat-square)](https://npmjs.com/package/discord.js-akinator) [![Discord Server](https://img.shields.io/discord/667479986214666272?logo=discord&logoColor=white&style=flat-square)](https://diamonddigital.dev/discord)

<a href="https://www.buymeacoffee.com/willtda" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Features

- 🌎 <b>100+ Languages Supported!</b> | Lightning fast translation has been made possible by Google Translate and hard-coded mappings!

- ▶️ <b>Buttons!</b> | Don't want to type out responses to questions? This package gives you the option to use discord's buttons to easily click your answer of choice!

- 🎮 <b>Multiple Game Types!</b> | This package will allow you to choose whether Akinator will guess an animal, character or object!

- 🙋 <b>Child Mode!</b> | Want to filter out NSFW questions? You can choose to enable Akinator's Child Mode to keep your games squeaky clean!

- ⚡️ <b>Quick & Easy Setup!</b> | This package was built with the intentions of working out-of-the-box. Only one parameter is required at least!

- 🤖 <b>Slash Command & Message Support!</b> | No matter how your bot receives its commands, you can simply pass in a `CommandInteraction` or `Message` and it will work!

## Installation & Compatibility List

To install this package, simply run the following command in your terminal:

`npm i discord.js-akinator --save`

**Please Note:** The latest release of this package is only compatible with Discord.js v14. If you are using Discord.js v13 or v12, please refer to the table below to find the version that suits your needs.

| Discord.js Version | Recommended Package Version |
|--------------------|-----------------------------|
| v14.x.x            | v4.x.x (`@latest`)          |
| v13.x.x            | v3.x.x (`@3.4.5`)           |
| v12.x.x            | v2.1.0 or earlier           |

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

//Example options for Discord.js Akinator:

const language = "en"; //The language of the game. Defaults to "en".
const childMode = false; //Whether to use Akinator's Child Mode. Defaults to "false".
const gameType = "character"; //The type of Akinator game to be played. ("animal", "character" or "object"). Defaults to "character".
const useButtons = true; //Whether to use Discord's buttons instead of message input for answering questions. Defaults to "true".
const embedColor = "#1F1E33"; //The color of the message embeds. Defaults to "Random".
const translationCachingOptions = {
    enabled: true, //Whether to cache translations. Defaults to "true". (Recommended)
    path: "./translationCache" //The path to the translation cache folder relative to the current working directory. Defaults to "./translationCache".
};
```
With Discord.js Akinator, you can choose whether you want to use a slash command, or a message as the input. Here's some quick examples on how to do both!

### Using Discord's Slash Commands as Input:

```js
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return; //If the interaction is not a slash command, do nothing
    if (interaction.commandName === "akinator") { //If the user sends "/akinator"...
        akinator(interaction, {
            language: language,
            childMode: childMode,
            gameType: gameType,
            useButtons: useButtons,
            embedColor: embedColor,
            translationCaching: translationCachingOptions
        });
    };
});
```

### Using a Message as Input:

```js
//IMPORTANT: Make sure to enable the "Message Content" intent for your bot in the Discord Developer Portal!

const PREFIX = "!"; //Your bot's command prefix

client.on("messageCreate", async message => {
    if (message.content.startsWith(`${PREFIX}akinator`)) { //When the user types "!akinator"...
        akinator(message, {
            language: language,
            childMode: childMode,
            gameType: gameType,
            useButtons: useButtons,
            embedColor: embedColor,
            translationCaching: translationCachingOptions
        });
    };
});
```

## Contributors

Special thanks to [many people](https://github.com/WillTDA/Discord.js-Akinator/graphs/contributors) helping to make language translation more accurate, refactor code, provide compatibility for new Discord.js versions, and so much more!

## Contact Us

- 👋 Need help? [Join our Discord Server](https://diamonddigital.dev/discord)!

- 👾 Found a bug, or inaccurate translations? [Open an issue](https://github.com/WillTDA/Discord.js-Akinator/issues), or fork and [submit a pull request](https://github.com/WillTDA/Discord.js-Akinator/pulls) on our [GitHub repository](https://github.com/WillTDA/Discord.js-Akinator)!
<hr>
<center>
<a href="https://diamonddigital.dev/"><strong>Created and maintained by</strong>
<img align="center" style="width:25%;height:auto" src="https://diamonddigital.dev/img/png/ddd_logo_text_transparent.png" alt="Diamond Digital Development Logo"></a>
</center>