const Canvas = require(`canvas`);
const { validateURL } = require(`../functions`);

module.exports = class Snyder {
    async getImage(image) {

        function drawImage(ctx, image, x, y, w, h, degrees) {
            ctx.save();
            ctx.translate(x + w / 2, y + h / 2);
            ctx.rotate(degrees * Math.PI / 180.0);
            ctx.translate(-x - w / 2, -y - h / 2);
            ctx.drawImage(image, x, y, w, h);
            ctx.restore();
        }

        if (!image) throw new Error(`You must provide an image as an argument`);
        let isValid = await validateURL(image);
        if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        const canvas = Canvas.createCanvas(610, 343);
        const ctx = canvas.getContext(`2d`);
        image = await Canvas.loadImage(image);
        const background = await Canvas.loadImage(`${__dirname}/../../assets/snyder.png`);
        ctx.fillRect(0, 0, 610, 343);
        drawImage(ctx, image, 62, 70, 300, 300, -6);
        ctx.drawImage(background, 0, 0, 610, 343);
        return canvas.toBuffer();
    }
};