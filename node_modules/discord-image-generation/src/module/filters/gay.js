const Canvas = require(`canvas`);
const { validateURL } = require(`../functions`);

module.exports = class Gay {
    async getImage(image) {
        if (!image) return console.error(`You must provide an image as a first argument.`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        let bg = await Canvas.loadImage(`${__dirname}/../../assets/gay.png`);
        let img = await Canvas.loadImage(image);
        const canvas = Canvas.createCanvas(480, 480);
        const ctx = canvas.getContext(`2d`);
        ctx.drawImage(img, 0, 0, 480, 480);
        ctx.drawImage(bg, 0, 0, 480, 480);
        return canvas.toBuffer();
    }
};