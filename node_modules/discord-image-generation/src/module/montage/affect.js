const jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Affect {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        let base = await jimp.read(`${__dirname}/../../assets/affect.png`);
        let img = await jimp.read(image);
        img.resize(200, 157);
        base.composite(img, 180, 383);
        return await base.getBufferAsync(`image/png`);
    }
};