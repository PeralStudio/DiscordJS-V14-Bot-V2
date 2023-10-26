const jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Sepia {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        image = await jimp.read(image);
        image.sepia();
        return await image.getBufferAsync(`image/png`);
    }
};