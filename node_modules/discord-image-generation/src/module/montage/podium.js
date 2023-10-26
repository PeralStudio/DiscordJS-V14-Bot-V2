const Canvas = require(`canvas`);
const {
    applyText
} = require(`../functions`);
const { validateURL } = require(`../functions`);
module.exports = class Podium {
    async getImage(image1, image2, image3, name1, name2, name3) {
        if (!image1) return console.error(`You must provide an image as a first argument.`);
        let isValid1 = await validateURL(image1);
        if (!isValid1) return console.error(`You must provide a valid image URL or buffer.`);
        if (!image2) return console.error(`You must provide an image as a second argument.`);
        let isValid2 = await validateURL(image2);
        if (!isValid2) return console.error(`You must provide a valid image URL or buffer.`);
        if (!image3) return console.error(`You must provide an image as a third argument.`);
        let isValid3 = await validateURL(image3);
        if (!isValid3) return console.error(`You must provide a valid image URL or buffer.`);
        if (!name1) return console.error(`You must provide a text as a fourth argument.`);
        if (!name2) return console.error(`You must provide a text as a fifth argument.`);
        if (!name3) return console.error(`You must provide a text as a sixth argument.`);
        const canvas = Canvas.createCanvas(1173, 686);
        const ctx = canvas.getContext(`2d`);
        image1 = await Canvas.loadImage(image1);
        image2 = await Canvas.loadImage(image2);
        image3 = await Canvas.loadImage(image3);
        const background = await Canvas.loadImage(`${__dirname}/../../assets/podium.png`);
        ctx.drawImage(image1, 409, 115, 350, 350);
        ctx.drawImage(image2, 96, 236, 225, 225);
        ctx.drawImage(image3, 853, 236, 225, 225);
        ctx.drawImage(background, 0, 0, 1173, 686);
        let maxWidth = 80;
        if (name1.length > 5) maxWidth = 150;
        if (name1.length > 10) maxWidth = 250;
        if (name1.length > 20) maxWidth = 350;
        ctx.textAlign = `center`;
        ctx.font = applyText(canvas, name1, 80, maxWidth, `Comic Sans MS`);
        ctx.fillStyle = `#513d34`;
        ctx.fillText(name1, 580, 575);
        maxWidth = 80;
        if (name2.length > 5) maxWidth = 150;
        if (name2.length > 10) maxWidth = 180;
        if (name2.length > 20) maxWidth = 240;
        ctx.textAlign = `center`;
        ctx.font = applyText(canvas, name2, 50, maxWidth, `Comic Sans MS`);
        ctx.fillStyle = `#513d34`;
        ctx.fillText(name2, 210, 540);
        maxWidth = 80;
        if (name3.length > 5) maxWidth = 150;
        if (name3.length > 10) maxWidth = 180;
        if (name3.length > 20) maxWidth = 240;
        ctx.textAlign = `center`;
        ctx.font = applyText(canvas, name3, 50, maxWidth, `Comic Sans MS`);
        ctx.fillStyle = `#513d34`;
        ctx.fillText(name3, 970, 540);
        return canvas.toBuffer();
    }
};