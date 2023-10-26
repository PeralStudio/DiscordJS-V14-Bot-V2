const Canvas = require(`canvas`);
const { validateURL } = require(`../functions`);

module.exports = class Heartbreaking {
    async getImage(image) {
        if (!image) throw new Error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = Canvas.createCanvas(610, 797);
        const ctx = canvas.getContext(`2d`);
        image = await Canvas.loadImage(image);
        const background = await Canvas.loadImage(`${__dirname}/../../assets/heartbreaking.png`);
        ctx.drawImage(image, 0, 150, 610, 610);
        ctx.drawImage(background, 0, 0, 610, 797);
        return canvas.toBuffer();
    }
};