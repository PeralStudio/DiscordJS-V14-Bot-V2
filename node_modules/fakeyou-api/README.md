# FakeYou-API

## An unofficial Node.JS library for the FakeYou API

Interact with the free FakeYou API easily with Node.JS

## Basic Usage

```
const { speak } = require("fakeyou-api");
(async () => {
    let res = await speak("TM:fm4h94vk4eem", "this is Artificial Intelligence");
    console.log(res);
})();
```

`res` will return a url to an MP3 containing the speech you entered.

[Voice used](https://fakeyou.com/tts/TM:fm4h94vk4eem)
