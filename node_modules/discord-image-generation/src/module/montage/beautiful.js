const jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Beautiful {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        let base = await jimp.read(`${__dirname}/../../assets/beautiful.png`);
        base.resize(376, 400);
        let img = await jimp.read(image);
        img.resize(84, 95);
        base.composite(img, 258, 28);
        base.composite(img, 258, 229);
        return await base.getBufferAsync(`image/png`);
    }
};