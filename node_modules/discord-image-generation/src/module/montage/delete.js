const jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Delete {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const background = await jimp.read(`${__dirname}/../../assets/delete.png`);
        image = await jimp.read(image);
        image.resize(195, 195);
        background.composite(image, 120, 135);
        return await background.getBufferAsync(`image/png`);
    }
};