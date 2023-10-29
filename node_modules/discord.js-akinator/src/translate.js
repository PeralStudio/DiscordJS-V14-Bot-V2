const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const translator = require("@vitalets/google-translate-api");

/**
 * 
 * @param {String} string String to translate.
 * @param {String} language Language to translate to.
 * @param {Boolean} cachingOptions Translation caching options.
 * @returns {String}
 */

module.exports = async function translate(string, language, cachingOptions) {
    if (!string) return console.log("Translator: No String Provided!")
    if (!language) return console.log("Translator: No Language Provided!")
    if (!cachingOptions) return console.log("Translator: No Caching Options Provided!")
    if (language === "en") return string; //the string will always be given in english so give the same text back

    let hashedString = crypto.createHash("md5").update(string).digest("hex"); //hash the string to use as key

    if (cachingOptions.enabled === true) {
        let currentCache = fs.existsSync(path.join(process.cwd(), cachingOptions.path, `${language}.json`)) ? JSON.parse(fs.readFileSync(path.join(process.cwd(), cachingOptions.path, `${language}.json`))) : {}; //load the cache file
        if (currentCache[hashedString]) {
            return currentCache[hashedString]; //return cached translation if it exists
        }
    }

    // if either cache is disabled or the cache doesn't exist, translate the string
    if (language === "zh") language = "zh-CN";
    if (language === "zhcn" || language === "zh-cn") language = "zh-CN";
    if (language === "zhtw" || language === "zh-tw") language = "zh-TW";
    let translation = await translator.translate(string, { to: language }).catch(e => console.log(e)); //translate the string using google translate
    if (!translation) return console.log("Translator: Error occured while translating.");
    translation = translation.text;

    //save the translation to the cache if caching is enabled
    if (cachingOptions.enabled === true) {
        //resolve the cache path, create directory if non-existent
        let cachePath = path.join(process.cwd(), cachingOptions.path);
        if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

        //resolve the cache file, create file if non-existent
        let cacheFile = path.join(cachePath, `${language}.json`);
        if (!fs.existsSync(cacheFile)) fs.writeFileSync(cacheFile, "{}");

        //load the cache file
        let cacheToSave = JSON.parse(fs.readFileSync(cacheFile));
        cacheToSave[hashedString] = translation; //add the translation to the cache
        fs.writeFileSync(cacheFile, JSON.stringify(cacheToSave)); //save the new state of the cache
    }

    //return the translation
    return translation;
}