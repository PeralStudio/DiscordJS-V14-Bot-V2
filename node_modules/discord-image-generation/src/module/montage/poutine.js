const Jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Poutine {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = new Jimp(600, 539);
        const img1 = await Jimp.read(image);
        const background = await Jimp.read(`${__dirname}/../../assets/poutine.png`);
        canvas.composite(img1, 350, 20);
        canvas.composite(background, 0, 0);
        return canvas.getBufferAsync(Jimp.MIME_PNG);
    }
};
