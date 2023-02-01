const googleTTS = require('google-tts-api');
const Stream = require('stream');
const langs = require("./langs")

function base64ToBinary(base64Text){
    
    const binary = Buffer.from(base64Text, "base64").toString("binary");
    
    const buffer = new ArrayBuffer(binary.length);
    
    let bytes = new Uint8Array(buffer);
    
    let i = 0;
    
    const bytesLength = buffer.byteLength;
    for (i; i < bytesLength; i++) {
bytes[i]=binary.charCodeAt(i) & 0xFF;
  }
    
  return bytes;
}

function base64toBinaryStream(base64Text){
  const binary = base64ToBinary(base64Text);
    
  const stream = new Stream.PassThrough();
    
  stream.write(binary, "binary");
    
  return stream;
}
                                
function downloadFromInfoCallback(stream, text, {lang, slow, host, timeout, splitPunct}) {
    googleTTS.getAudioBase64(text, { lang, slow, host, timeout, splitPunct })
      .then(base64Audio => base64toBinaryStream(base64Audio))
      .then(audioStream => audioStream.pipe(stream))
      .catch(console.error);
}

function getVoiceStream(text, { lang = 'en', slow = false, host = 'https://translate.google.com', timeout = 10000, splitPunct } = {}) {
    const stream = new Stream.PassThrough();
    
    downloadFromInfoCallback(stream, text, {lang, slow, host, timeout, splitPunct });
    
    return stream;
}

function findLocale(locale) {
  let loc = langs[locale]
  
  if(loc) {
    return true;
  } else {
    return false
  }
}

function getAllLocales() {
  let array = []
  
  Object.keys(langs).map(c => {
    array.push(`${c} => ${langs[c]}`)
  })
  
  return array;
}

module.exports.getVoiceStream = getVoiceStream
module.exports.findLocale = findLocale
module.exports.getAllLocales = getAllLocales