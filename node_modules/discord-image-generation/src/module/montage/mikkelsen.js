const Canvas = require(`canvas`);
const { validateURL } = require(`../functions`);

module.exports = class Mikkelsen {
    async getImage(image) {
        if (!image) throw new Error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = Canvas.createCanvas(610, 955);
        const ctx = canvas.getContext(`2d`);
        image = await Canvas.loadImage(image);
        const background = await Canvas.loadImage(`${__dirname}/../../assets/mikkelsen.png`);
        ctx.drawImage(image, 20, 460, 580, 580);
        ctx.drawImage(background, 0, 0, 610, 955);
        return canvas.toBuffer();
    }
};