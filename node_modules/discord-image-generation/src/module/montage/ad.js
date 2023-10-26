const Jimp = require('jimp');
const { validateURL } = require(`../functions`);
module.exports = class Ad {
    async getImage(image1) {
        if (!image1) return console.error(`You must provide an image as an argument`);
        let isValid = await validateURL(image1);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const image1Buffer = await Jimp.read(image1);
        image1Buffer.resize(230, 230);
        const background = await Jimp.read(`${__dirname}/../../assets/ad.png`);
        background.composite(image1Buffer, 150, 75);
        return background.getBufferAsync(Jimp.MIME_PNG);
    }
};
