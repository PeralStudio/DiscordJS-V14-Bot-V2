const Canvas = require(`canvas`);
const { validateURL } = require(`../functions`);
module.exports = class Stonk {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = Canvas.createCanvas(900, 539);
        const ctx = canvas.getContext(`2d`);
        image = await Canvas.loadImage(image);
        const background = await Canvas.loadImage(`${__dirname}/../../assets/stonk.png`);
        ctx.drawImage(image, 70, 40, 240, 240);
        ctx.drawImage(background, 0, 0, 900, 539);
        return canvas.toBuffer();
    }
};
