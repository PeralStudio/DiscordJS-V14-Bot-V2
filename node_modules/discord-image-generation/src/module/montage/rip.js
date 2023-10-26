const Canvas = require(`canvas`);
const { validateURL } = require(`../functions`);
module.exports = class Rip {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = Canvas.createCanvas(720, 405);
        const ctx = canvas.getContext(`2d`);
        const background = await Canvas.loadImage(`${__dirname}/../../assets/rip.png`);
        const avatar = await Canvas.loadImage(image);
        ctx.drawImage(avatar, 110, 47, 85, 85);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        return canvas.toBuffer();
    }
};