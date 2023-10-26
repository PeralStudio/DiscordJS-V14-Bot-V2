const Canvas = require(`canvas`);
const { validateURL } = require(`../functions`);
module.exports = class Thomas {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = Canvas.createCanvas(841, 1058);
        const ctx = canvas.getContext(`2d`);
        const avatar = await Canvas.loadImage(image);
        const background = await Canvas.loadImage(`${__dirname}/../../assets/thomas.png`);
        ctx.drawImage(avatar, 220, 190, 400, 400);
        ctx.drawImage(background, 0, 0, 841, 1058);
        return canvas.toBuffer();
    }
};