const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

// Función para obtener la fecha y hora local en el formato DD-MM-YYYY HH:mm:ss
const localTimestamp = format.timestamp({
    format: () => {
        const now = new Date();

        // Opciones para formatear la fecha y hora
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Europe/Madrid"
        };

        const formatter = new Intl.DateTimeFormat("es-ES", options);
        const [date, time] = formatter.format(now).split(", ");

        return `${date} ${time}`;
    }
});

const logger = createLogger({
    level: "info",
    format: format.combine(
        localTimestamp,
        format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
    ),
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/bot-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "7d",
            zippedArchive: true
        }),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(
                    (info) => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`
                )
            )
        })
    ]
});

module.exports = logger;
