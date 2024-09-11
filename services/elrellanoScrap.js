const axios = require("axios");
const cheerio = require("cherio");
const superDjs = require("super-djs");
const cron = require("node-cron");
const elrellano = require("../schemas/elrellanoSchema");
const dotenv = require("dotenv");
const deleteOldMsg = require("./deleteOldMsg.js");
const checkRepeatMsgs = require("./checkRepeatMsgs.js");
const { format, parseISO, addHours } = require("date-fns");
dotenv.config();

const elrellanoScrap = async (client) => {
    const { ELRELLANO_CHANNEL_ID } = process.env;
    let videos = [];

    cron.schedule(
        "*/30 8-23,0-1 * * *", // Cada 30min de 08:00 a 23:59 y también desde 00:00 hasta 01:00
        async () => {
            //Delete old messages
            deleteOldMsg(client, ELRELLANO_CHANNEL_ID);

            console.log(
                superDjs.colourText(
                    `Comprobando si hay videos nuevos de 🎦 Elrellano.com ${new Date().toLocaleTimeString(
                        "es-ES",
                        {
                            timeZone: "Europe/Madrid"
                        }
                    )}`,
                    "blue"
                )
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

                    if (videoUrlYT && videoUrlYT.includes("rumble")) {
                        // videoUrlYT = videoUrlYT.replace("/embed/", "/").replace("/?pub=c0in", "");  Get link but not working to see the video.
                        videoUrlYT = undefined;
                    }

                    if (!videoUrlYT) {
                        videoUrlYT = $(element)
                            .find(".entry-content .wp-block-embed iframe")
                            .attr("src");
                    }

                    // Extraer la fecha de publicación
                    const datePublishedRaw = $(element)
                        .find("time.entry-date.published")
                        .attr("datetime");

                    // Sumar 2 horas si estás seguro de que el datetime es UTC
                    const datePublished = datePublishedRaw
                        ? format(addHours(parseISO(datePublishedRaw), 2), "HH:mm dd/MM/yyyy")
                        : "";

                    let partes = datePublished.split(" ");

                    let horaMinuto = partes[0].split(":");
                    let hora = parseInt(horaMinuto[0], 10);
                    let minuto = parseInt(horaMinuto[1], 10);

                    let fecha = partes[1].split("/");
                    let dia = parseInt(fecha[0], 10);
                    let mes = parseInt(fecha[1], 10) - 1;
                    let año = parseInt(fecha[2], 10);

                    let fechaLocal = new Date(año, mes, dia, hora, minuto);
                    let fechaUTC = new Date(fechaLocal.toISOString());
                    let timestamp = Math.floor(fechaUTC.getTime() / 1000 - 7200);

                    videos.push({
                        title: title ? title : "",
                        summary: summary ? summary : "",
                        url: !videoUrlYT
                            ? videoUrl
                            : videoUrl && videoUrlYT
                            ? videoUrl
                            : videoUrlYT,
                        // type: "Vídeos",
                        date: datePublished
                            ? datePublished
                            : new Date().toLocaleString("es-ES", {
                                  timeZone: "Europe/Madrid"
                              }),
                        timestamp
                    });
                });

                videos.forEach(async (video, i) => {
                    console.log(
                        `Verificando si existe video en BBDD || post: ${i} - Título: ${video?.title}`
                    );

                    if (video.url) {
                        const data = await elrellano.findOne({
                            // title: video?.title,
                            videoUrl: video?.url
                        });

                        if (!data) {
                            console.log(`video no existe en BBDD  ${i} - Título: ${video.title}`);

                            const newData = new elrellano({
                                title: video.title,
                                summary: video.summary,
                                videoUrl: video.url,
                                // type: video.type,
                                date: video.date,
                                timestamp: video.timestamp
                            });

                            let partes = video.date.split(" ");

                            let horaMinuto = partes[0].split(":");
                            let hora = parseInt(horaMinuto[0], 10);
                            let minuto = parseInt(horaMinuto[1], 10);

                            let fecha = partes[1].split("/");
                            let dia = parseInt(fecha[0], 10);
                            let mes = parseInt(fecha[1], 10) - 1;
                            let año = parseInt(fecha[2], 10);

                            let fechaLocal = new Date(año, mes, dia, hora, minuto);
                            let fechaUTC = new Date(fechaLocal.toISOString());
                            let timestamp = Math.floor(fechaUTC.getTime() / 1000 - 7200);

                            await client.channels.cache.get(ELRELLANO_CHANNEL_ID).send({
                                content:
                                    "`Título:` " +
                                    video.title +
                                    (video.summary && "\n" + "`Descripción:`" + video.summary) +
                                    `\n Fecha: <t:${timestamp}:R>` +
                                    /* "\n`Categoría:`" +
                                video.type + */
                                    "\n" +
                                    video.url
                            });

                            await newData.save();

                            console.log(
                                superDjs.colourText(
                                    `¡Nuevos videos encontrados! 🎦-elrellano ${new Date().toLocaleTimeString(
                                        "es-ES",
                                        {
                                            timeZone: "Europe/Madrid"
                                        }
                                    )} \n(${i}) - Video Guardado en BBDD ${newData}`,
                                    "green"
                                )
                            );
                        } else {
                            console.log(`Video ya existe en BBDD: ${i} - Título: ${data.title}`);
                        }
                    }
                });

                videos = [];

                await checkRepeatMsgs(client, ELRELLANO_CHANNEL_ID);
            } catch (error) {
                console.error(error);
            }
        },
        {
            timezone: "Europe/Madrid"
        }
    );
};

module.exports = elrellanoScrap;
