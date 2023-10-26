const jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Batslap {
    async getImage(image1, image2) {
        if (!image1) return console.error(`You must provide an image as a first argument.`);
        let isValid1 = await validateURL(image1);
        if (!isValid1) return console.error(`You must provide a valid image URL or buffer.`);
        if (!image2) return console.error(`You must provide an image as a second argument.`);
        let isValid2 = await validateURL(image1);
        if (!isValid2) return console.error(`You must provide a valid image URL or buffer.`);
        let base = await jimp.read(`${__dirname}/../../assets/batslap.png`);
        image1 = await jimp.read(image1);
        image2 = await jimp.read(image2);
        image1.circle();
        image2.circle();
        base.resize(1000, 500);
        image1.resize(220, 220);
        image2.resize(200, 200);
        base.composite(image2, 580, 260);
        base.composite(image1, 350, 70);
        return await base.getBufferAsync(`image/png`);
    }
};