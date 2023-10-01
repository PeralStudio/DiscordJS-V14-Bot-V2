const fs = require("fs")
let array = []
let total = 0

fs.readdirSync("./src/").forEach(dir => {
  const files = fs.readdirSync(`./src/${dir}/`).filter(f => f.endsWith(".mp4") || f.endsWith(".mp3"))
  
  array.push({
    category: dir,
    files: []
  })
  
  let Arr = array.find(c => c.category === dir)
  
  files.forEach(file => {
    Arr.files.push(`+ - ${file.split(".")[0]}`)
  })
})

array.map(c => {
  c.files.map(f => {
    total++
  })
})

fs.writeFileSync("readme.MD", [
  `<p ="center">
   <img src="https://img.shields.io/npm/dt/djs-soundboard?style=for-the-badge">
   <img src="https://img.shields.io/npm/v/djs-soundboard?style=for-the-badge">
   <a href = "https://discord.gg/7UQaVPBQka" > <img src="https://img.shields.io/badge/Server-Invite-brightgreen" href = "">
   </a>
</p>`,
   "",
   "# Invite Bot:",
   "",
   "+ https://dsc.gg/waifu.gg",
   "",
   "# Example",
   "",
   "+ Soundboard:",
   "```js",
   'const SoundBoard = require("djs-soundboard")',
   "",
   "let sound = new SoundBoard()",
   "",
   'let channel = message.member.voice.channel // required*',
   "",
   'sound.play(channel, "bruh") //Sound',
   '```',
   "",
   "+ TTS",
   "```js",
   'const SoundBoard = require("djs-soundboard")',
   "",
   "let sound = new SoundBoard()",
   "",
   'let channel = message.member.voice.channel // required*',
   "",
   'sound.tts(channel, "bruh") //Text',
   "```",
   "",
   "```js",
   "+ Functions:",
   "+ - 1: getAllSounds => get all soundboard sounds\nType: Array.",
   "",
   "+ - 2: getAllLocales => get all supported languages for tts\nType: Array.",
   "```",
   "",
   '# Sounds:',
   array.map(c => {
     return `\n\n+ ${c.category.toUpperCase()}\n${c.files.join("\n")}`
   }),
   "",
   "Total Sounds:",
   `${total}`,
   "",
   `Last Updated: ${new Date()}`
].join("\n"))