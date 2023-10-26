const Jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class NotStonk {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = new Jimp(960, 576);
        const img1 = await Jimp.read(image);
        const background = await Jimp.read(`${__dirname}/../../assets/notStonk.png`);
        img1.resize(190, 190);
        background.resize(960, 576);
        canvas.composite(img1, 140, 5);
        canvas.composite(background, 0, 0);
        return canvas.getBufferAsync(Jimp.MIME_PNG);
    }
};
