const Jimp = require('jimp');
const { validateURL } = require(`../functions`);
module.exports = class DiscordBlue {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const background = await Jimp.read(`${__dirname}/../../assets/discordblue.png`);
        const image1 = await Jimp.read(image);
        image1.resize(background.getWidth(), background.getHeight());
        const compositeImage = new Jimp(background.getWidth(), background.getHeight(), 0xFFFFFFFF);
        compositeImage.composite(image1, 0, 0);
        compositeImage.composite(background, 0, 0);
        return await compositeImage.getBufferAsync(Jimp.MIME_PNG);
    }
};
