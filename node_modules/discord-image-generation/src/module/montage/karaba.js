const Jimp = require('jimp');
const { validateURL } = require(`../functions`);
module.exports = class Karaba {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        let bg = await Jimp.read(`${__dirname}/../../assets/karaba.png`);
        let img = await Jimp.read(image);
        const compositeImage = new Jimp(bg.getWidth(), bg.getHeight(), 0xFFFFFFFF);
        img.resize(130, 130);
        bg.resize(bg.getWidth(), bg.getHeight());
        compositeImage.composite(img, 130, 44);
        compositeImage.composite(bg, 0, 0);
        return await compositeImage.getBufferAsync(Jimp.MIME_PNG);
    }
};
