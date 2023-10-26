const jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Denoise {
    async getImage(image, level = 1) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        if (isNaN(level)) level = 1;
        if (level > 10) level = 10;
        if (level < 1) level = 1;
        image = await jimp.read(image);
        // apply gaussBlur
        image.gaussian(level);
        return await image.getBufferAsync(`image/png`);
    }
};