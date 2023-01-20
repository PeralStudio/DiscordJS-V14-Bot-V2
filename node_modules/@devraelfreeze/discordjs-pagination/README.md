<p align="center"><a href="https://nodei.co/npm/@devraelfreeze/discordjs-pagination/"><img src="https://nodei.co/npm/@devraelfreeze/discordjs-pagination.png" alt=""></a></p>

<div align="center">
<a href="https://github.com/devRael1/discordjs-pagination/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/devRael1/discordjs-pagination"></a>
<a href="https://github.com/devRael1/discordjs-pagination/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/devRael1/discordjs-pagination"></a>
<a href="https://github.com/devRael1/discordjs-pagination/blob/master/MIT-LICENCE"><img alt="GitHub license" src="https://img.shields.io/github/license/devRael1/discordjs-pagination?color=red"></a>
<img alt="npm" src="https://img.shields.io/npm/dw/@devraelfreeze/discordjs-pagination?color=purple">
<br>
<img alt="npm (tag)" src="https://img.shields.io/npm/v/@devraelfreeze/discordjs-pagination/latest?color=yellow&label=%40devraelfreeze%2Fdiscordjs-pagination">
</div>

# `❓ discordjs-pagination`

An advanced module with quick setup and different options to implement pagination system for Discord.js.
<br>**_The 2... versions of the package will only support discord.js v14._**

### <br>If you want this package for discord.js v13, please install v1.8...

## `📥 Installation`

To install this module type the following command in your console:
```
npm i @devraelfreeze/discordjs-pagination
```

## ⚙️ Pagination Module Options
| Options Object Name | Default Type | Description |
| :--- | :---: | :--- |
| `interaction` | `CommandInteraction` <br />or `Interaction` | Interaction to reply with the pagination system <br />(The interaction can be deferred or replied) |
| `message` | `Message` | Message Class to send the pagination system |
| `ephemeral` | `boolean` | If the returned message should be ephemeral (Can only use in Interaction) |
| `embeds` | `[]` | Array of embeds to paginate |
| `author` | `User` | Author's user class |
| `buttons` | `Buttons[]` | Customization of your buttons <br />See examples below  |
| `disableButtons` | `boolean` | Disable or remove buttons after timeout |
| `pageTravel` | `boolean` | Travel pages by sending page numbers? (With Modal Interaction) |
| `fastSkip` | `boolean` | Create two additional buttons, a button to skip to the end and a button to skip to the first page |
| `time` | `number` | How long before pagination get disabled **(in ms)** |
| `max` | `number` | Maximum interactions with buttons before disabling the pagination |
| `customFilter` | `boolean` | Custom filter for message component collector <br /> **Must return boolean** |


## `⬇️ Examples`
### Declare & Use Pagination System
```js
/** Decalre the module */
const { pagination, TypesButtons, StylesButton } = require('@devraelfreeze/discordjs-pagination');
/** Use pagination system */
await pagination({
    /** Pagination options here */
});
```
---
### Use pagination System with custom buttons
```js
await pagination({
    embeds: arrayEmbeds, // Array of embeds objects
    author: interaction.member.user,
    interaction: interaction,
    ephemeral: true,
    time: 40000, // 40 seconds
    disableButtons: false, // Remove buttons after timeout
    fastSkip: false,
    pageTravel: false,
    buttons: [
        {
            value: TypesButtons.previous,
            label: 'Previous Page',
            style: StylesButton.Primary
        },
        {
            value: TypesButtons.next,
            label: 'Next Page',
            style: StylesButton.Success
        }
    ]
});
```
---
### Use pagination System with custom buttons and custom filter
```js
await pagination({
    interaction: interaction,
    embeds: arrayEmbeds, // Array of embeds objects
    author: interaction.member.user,
    time: 40000, // 40 seconds
    fastSkip: false,
    disableButtons: true,
    pageTravel: false,
    /** Enable buttons pagination system only for member with ID: 123456789 */
    customFilter: (interaction) => {
        return interaction.member.user.id === '123456789';
    },
    buttons: [
        {
            value: TypesButtons.previous,
            label: 'Previous Page',
            style: StylesButton.Success,
            emoji: '◀️'
        },
        {
            value: TypesButtons.next,
            label: 'Next Page',
            style: StylesButton.Success,
            emoji: null // Disable emoji for this button
        }
    ]
});
```

## `🐛 Bug Reports`

If you have any bugs or trouble setting the module up, feel free to open an issue on [Github Repository](https://github.com/devRael1/discordjs-pagination)
<br>
### If you want more support, you can contact me on Discord: `devRael#0123`

## `🗃️ Old Versions`
If you want to use old version, you can use command
```
npm i @devraelfreeze/discordjs-pagination@<version>
```

## `📝 License`
Copyright © 2022 [devRael1](https://github.com/devRael1)
<br>This project is MIT licensed.
<br>This is not an official Discord product. It is not affiliated with or endorsed by Discord Inc.