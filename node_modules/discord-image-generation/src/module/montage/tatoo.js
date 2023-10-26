const Canvas = require(`canvas`);
const { validateURL } = require(`../functions`);
module.exports = class Tatoo {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = Canvas.createCanvas(750, 1089);
        const ctx = canvas.getContext(`2d`);
        const avatar = await Canvas.loadImage(image);
        const background = await Canvas.loadImage(`${__dirname}/../../assets/tatoo.png`);
        ctx.drawImage(avatar, 145, 575, 400, 400);
        ctx.drawImage(background, 0, 0, 750, 1089);
        return canvas.toBuffer();
    }
};