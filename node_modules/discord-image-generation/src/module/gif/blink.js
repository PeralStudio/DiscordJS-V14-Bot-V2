const Canvas = require(`canvas`);
const GIFEncoder = require(`gifencoder`);
const { validateURL } = require(`../functions`);
module.exports = class Blink {
    async getImage(delay, ...images) {
        if (!images || images.length < 2) return console.error(`You must provide at least two images.`);

        if (isNaN(delay)) return console.error(`You must provide a valid delay.`);
        for (const image of images) {
            let isValid = await validateURL(image);
            if (!isValid) return console.error(`You must provide a valid image URL or buffer.`);
        }

        const GIF = new GIFEncoder(480, 480);
        GIF.start();
        GIF.setRepeat(0);
        GIF.setDelay(delay);
        GIF.setTransparent();

        const canvas = Canvas.createCanvas(480, 480);

        for (const image of images) {
            const base = await Canvas.loadImage(image);
            const ctx2 = canvas.getContext(`2d`);
            ctx2.clearRect(0, 0, 480, 480);
            ctx2.drawImage(base, 0, 0, 480, 480);
            GIF.addFrame(ctx2);
        }

        GIF.finish();
        return GIF.out.getData();
    }
};