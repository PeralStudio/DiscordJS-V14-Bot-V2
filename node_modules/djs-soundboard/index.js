const { getSound } = require("./sounds")
const fs = require("fs")
const { createAudioResource, getVoiceConnection, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, StreamType } = require("@discordjs/voice")
const path = require("path")
const { getVoiceStream, getAllLocales, findLocale } = require("./functions")

class SoundBoard {
  constructor(options) {
    
  }
  
  async play(channel, sound) {
    
    let Sound = getSound(sound)
    
    if(!Sound) throw new TypeError("[soundboard]: InValid Sound.")
    
    let connection = getVoiceConnection(channel.guild.id)
    
    if(!connection) {
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      })
    }
    
    let player = createAudioPlayer()
    let res = createAudioResource(path.join(__dirname, `./src/${Sound.file}`))
    
    player.play(res)
    connection.subscribe(player)
    
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy()
    })
  }
  
  getAllSounds() {
    let array = []
    
    fs.readdirSync(path.join(__dirname, "./src")).forEach(dir => {
      
      let files = fs.readdirSync(path.join(__dirname, `./src/${dir}/`)).filter(f => f.endsWith(".mp4") || f.endsWith(".mp3"))
      
      array.push({
        category: dir,
        sounds: []
      })
      
      let Arr = array.find(c => c.category === dir)
      
      files.forEach(file => {
        Arr.sounds.push(file.split(".")[0])
      })
    })
    
    return array;
  }
  
  tts(channel, text, Lang, Speed) {
    
    if(Lang && !findLocale(Lang)) throw new TypeError("[soundboard]: InValid Locale.")
    
    let connection = getVoiceConnection(channel.guild.id)
    
    if(!connection) {
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      })
    }
    
    let player = createAudioPlayer()
    
    let stream = getVoiceStream(text, {lang: Lang ? Lang : "en", slow: Speed ? Speed : false})
    
    let res = createAudioResource(stream, {
      inputType: StreamType.Arbitrary, 
      inlineVolume:true
    });
    
    player.play(res)
    
    connection.subscribe(player)
    
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy()
    })
  }
  
  getAllLocales() {
    let array = getAllLocales()
    
    return array;
  }
}

module.exports = SoundBoard