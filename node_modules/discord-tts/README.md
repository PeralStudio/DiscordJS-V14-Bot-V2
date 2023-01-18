# discord-tts
Node.js module to make your discord bot talk

## Quick Example for discord.js v12
```js
const secret = require('./secret.json'); //file with your bot credentials/token/etc
const discord = require('discord.js');
const discordTTS = require('discord-tts');
const client = new discord.Client();
client.login(secret.token);

client.on('ready', () => {
    console.log('Online');
});

client.on('message', msg => {
    if(msg.content === 'say test 123'){
        const broadcast = client.voice.createBroadcast();
        const channelId = msg.member.voice.channelID;
        const channel = client.channels.cache.get(channelId);
        channel.join().then(connection => {
            broadcast.play(discordTTS.getVoiceStream('test 123'));
            const dispatcher = connection.play(broadcast);
        });
    }
});
```
## Tested working with discord.js v12
    OS Windows 10
    Node.js v12.16.1
    discord.js v^12.2.0
    @discordjs/opus: github:discordjs/opus,
    ffmpeg v0.0.4
    ffmpeg-binaries v3.2.2-3
    opusscript v0.0.7

## Quick Example for discord.js v13
```js
const secret = require('./secret.json'); //file with your bot credentials/token/etc
const discordTTS=require("discord-tts");
const {Client, Intents} = require("discord.js");
const {AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel} = require("@discordjs/voice");

const intents=
[
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILDS
];

const client = new Client({intents:intents});
client.login(secret.token);

client.on("ready", () => console.log("Online"));

let voiceConnection;
let audioPlayer=new AudioPlayer();

client.on("messageCreate", async (msg)=>{
    if(msg.content=="tts")
    {
        const stream=discordTTS.getVoiceStream("hello text to speech world");
        const audioResource=createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});
        if(!voiceConnection || voiceConnection?.status===VoiceConnectionStatus.Disconnected){
            voiceConnection = joinVoiceChannel({
                channelId: msg.member.voice.channelId,
                guildId: msg.guildId,
                adapterCreator: msg.guild.voiceAdapterCreator,
            });
            voiceConnection=await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
        }
        
        if(voiceConnection.status===VoiceConnectionStatus.Connected){
            voiceConnection.subscribe(audioPlayer);
            audioPlayer.play(audioResource);
        }
    }
});
```
## Tested working with for discord.js v13
    OS Windows 10
    Node.js v16.8.0
    @discordjs/opus ^0.6.0
    @discordjs/rest ^0.1.0-canary.0
    @discordjs/voice ^0.6.0
    @sapphire/snowflake ^1.3.6
    discord-tts ^1.2.0
    discord.js ^13.2.0
    libsodium-wrappers ^0.7.9

## Contributing
- Have [Git](https://git-scm.com/) Installed
- Have [Node.js](https://nodejs.org/en/) Installed

```bash
$ git clone https://github.com/mundoex/discord-tts.git
$ npm install
```
Make a pull request with your changes <br>
Contributions, features request or any other kind of help are very welcome :)

## License
[MIT](LICENSE)
