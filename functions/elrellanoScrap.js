const axios = require("axios");
const cheerio = require("cherio");
const elrellano = require("../schemas/elrellanoSchema");
const dotenv = require("dotenv");
const deleteOldMsg = require("./deleteOldMsg.js");
dotenv.config();

const elrellanoScrap = async (client) => {
    const { ELRELLANO_CHANNEL_ID } = process.env;
    const videos = [];

    setInterval(async () => {
        //Delete old messages
        deleteOldMsg(client, ELRELLANO_CHANNEL_ID);

        console.log(
            `Comprobando si hay videos nuevos de 🎦 Elrellano.com ${new Date().toLocaleTimeString(
                "es-ES",
                {
                    timeZone: "Europe/Madrid",
                }
            )}`
        );

        // try {
        //     const response = await axios.get("https://elrellano.com/imagenes/");
        //     const $ = cheerio.load(response.data);

        //     // Push to videos(array) the images
        //     $(".inside-article").each(async (i, element) => {
        //         const title = $(element).find(".entry-header h2 > a").text();
        //         const summary = $(element).find(".entry-content p").text();
        //         const imageUrl = $(element)
        //             .find(".entry-content .wp-block-image > figure > img")
        //             .attr("src");
        //         const imageUrl2 = $(element)
        //             .find(".entry-content .wp-block-image > img")
        //             .attr("src");
        //         const videoUrl = $(element).find(".wp-block-video video").attr("src");
        //         const videoUrlYT = $(element).find(".entry-content iframe").attr("src");

        //         if (!imageUrl && !imageUrl2) return;
        //         if (videoUrl || videoUrlYT) return;
        //         if (
        //             (videoUrlYT && imageUrl) ||
        //             (videoUrlYT && imageUrl2) ||
        //             (videoUrl && imageUrl) ||
        //             (videoUrl && imageUrl2)
        //         )
        //             return;

        //         videos.push({
        //             title: title ? title : "",
        //             summary: summary ? summary : "",
        //             url: imageUrl ? imageUrl : imageUrl2,
        //             type: "Imágenes",
        //             date: new Date().toLocaleString("es-ES", {
        //                 timeZone: "Europe/Madrid",
        //             }),
        //         });
        //     });
        // } catch (error) {
        //     console.error(error);
        // }

        // try {
        //     const response = await axios.get("https://elrellano.com/vinetas/");
        //     const $ = cheerio.load(response.data);

        //     // Push to videos(array) the viñetas
        //     $(".inside-article").each(async (i, element) => {
        //         const title = $(element).find(".entry-header h2 > a").text();
        //         const summary = $(element).find(".entry-content p").text();
        //         const imageUrl = $(element)
        //             .find(".entry-content .wp-block-image > figure > img")
        //             .attr("src");
        //         const imageUrl2 = $(element)
        //             .find(".entry-content .wp-block-image > img")
        //             .attr("src");

        //         if (!imageUrl && !imageUrl2) return;

        //         videos.push({
        //             title: title ? title : "",
        //             summary: summary ? summary : "",
        //             url: imageUrl ? imageUrl : imageUrl2,
        //             type: "Viñetas",
        //             date: new Date().toLocaleString("es-ES", {
        //                 timeZone: "Europe/Madrid",
        //             }),
        //         });
        //     });
        // } catch (error) {
        //     console.error(error);
        // }

        try {
            const response = await axios.get("https://elrellano.com/videos/");
            const $ = cheerio.load(response.data);
            let videoUrlYT;

            // Push to videos(array) the videos
            $(".inside-article").each(async (i, element) => {
                const title = $(element).find(".entry-header h2 > a").text();
                const summary = $(element).find(".entry-content p").text();
                const videoUrl = $(element).find(".wp-block-video video").attr("src");
                videoUrlYT = $(element).find(".entry-content iframe").attr("src");

                if (!videoUrlYT) {
                    videoUrlYT = $(element)
                        .find(".entry-content .wp-block-embed iframe")
                        .attr("src");
                }

                videos.push({
                    title: title ? title : "",
                    summary: summary ? summary : "",
                    url: !videoUrlYT ? videoUrl : videoUrl && videoUrlYT ? videoUrl : videoUrlYT,
                    // type: "Vídeos",
                    date: new Date().toLocaleString("es-ES", {
                        timeZone: "Europe/Madrid",
                    }),
                });
            });

            videos.forEach(async (video, i) => {
                if (video.url) {
                    const data = await elrellano.findOne({
                        title: video?.title,
                        videoUrl: video?.url,
                    });

                    if (!data) {
                        const newData = new elrellano({
                            title: video.title,
                            summary: video.summary,
                            videoUrl: video.url,
                            // type: video.type,
                            date: new Date().toLocaleString("es-ES", {
                                timeZone: "Europe/Madrid",
                            }),
                        });

                        await client.channels.cache.get(ELRELLANO_CHANNEL_ID).send({
                            content:
                                "`Título:` " +
                                video.title +
                                (video.summary && "\n" + "`Descripción:`" + video.summary) +
                                "\n`Fecha:`" +
                                video.date +
                                /* "\n`Categoría:`" +
                                video.type + */
                                "\n" +
                                video.url,
                        });

                        await newData.save();

                        console.log(
                            `¡Nuevos videos encontrados! 🎦-elrellano ${new Date().toLocaleTimeString(
                                "es-ES",
                                {
                                    timeZone: "Europe/Madrid",
                                }
                            )}`
                        );
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }
    }, 1800000); //2-Hours 7200000 //30-Minutes 1800000
};

module.exports = elrellanoScrap;
