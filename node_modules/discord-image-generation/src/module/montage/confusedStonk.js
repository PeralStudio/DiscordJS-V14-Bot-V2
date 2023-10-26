const Jimp = require('jimp');
const { validateURL } = require(`../functions`);
module.exports = class ConfusedStonk {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const image1 = await Jimp.read(image);
        const background = await Jimp.read(`${__dirname}/../../assets/confusedStonk.png`);
        image1.resize(400, 400);
        const compositeImage = new Jimp(background.getWidth(), background.getHeight(), 0xFFFFFFFF);
        compositeImage.composite(image1, 190, 70);
        compositeImage.composite(background, 0, 0);
        return await compositeImage.getBufferAsync(Jimp.MIME_PNG);
    }
};
