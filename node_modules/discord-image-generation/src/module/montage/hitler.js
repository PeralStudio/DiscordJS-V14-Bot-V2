const jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Hitler {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        let bg = await jimp.read(`${__dirname}/../../assets/hitler.png`);
        let img = await jimp.read(image);
        img.resize(140, 140);
        bg.composite(img, 46, 43);
        return await bg.getBufferAsync(`image/png`);
    }
};