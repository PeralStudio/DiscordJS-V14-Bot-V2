const Jimp = require('jimp');
const { validateURL } = require(`../functions`);
module.exports = class Facepalm {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as an argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const layer = await Jimp.read(`${__dirname}/../../assets/facepalm.png`);
        const avatar = await Jimp.read(image);
        const compositeImage = new Jimp(layer.getWidth(), layer.getHeight(), 0xFFFFFFFF);
        avatar.resize(235, 235);
        compositeImage.composite(avatar, 199, 112);
        compositeImage.composite(layer, 0, 0);
        return await compositeImage.getBufferAsync(Jimp.MIME_PNG);
    }
};
