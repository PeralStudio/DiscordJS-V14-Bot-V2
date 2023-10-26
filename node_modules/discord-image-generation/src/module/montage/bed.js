const jimp = require(`jimp`);
const { validateURL } = require(`../functions`);
module.exports = class Bed {
    async getImage(image1, image2) {
        if (!image1) return console.error(`You must provide an image as a first argument.`);
        let isValid1 = await validateURL(image1);
        if (!isValid1) return console.error(`You must provide a valid image URL or buffer.`);
        if (!image2) return console.error(`You must provide an image as a second argument.`);
        let isValid2 = await validateURL(image2);
        if (!isValid2) return console.error(`You must provide a valid image URL or buffer.`);
        let bg = await jimp.read(`${__dirname}/../../assets/bed.png`);
        image1 = await jimp.read(image1);
        image2 = await jimp.read(image2);
        image1.circle();
        image2.circle();
        image1.resize(100, 100);
        image2.resize(70, 70);
        let image3 = image1.clone().resize(70, 70);
        bg.composite(image1, 25, 100);
        bg.composite(image1, 25, 300);
        bg.composite(image3, 53, 450);
        bg.composite(image2, 53, 575);
        return await bg.getBufferAsync(`image/png`);
    }
};