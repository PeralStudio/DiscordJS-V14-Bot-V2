const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

// Define niveles de log personalizados
const customLevels = {
    levels: {
        title: 0,
        error: 1,
        warn: 2,
        success: 3,
        info: 4,
        verbose: 5,
        gold: 6,
        red: 6,
        debug: 7
    },
    colors: {
        title: "bold magenta",
        error: "bold red",
        warn: "bold yellow",
        success: "bold green",
        info: "bold cyan",
        verbose: "bold blue",
        gold: "bold yellow",
        red: "red yellow",
        debug: "bold gray"
    }
};

require("winston").addColors(customLevels.colors);

// Función para obtener la fecha y hora local en el formato DD-MM-YYYY HH:mm:ss
const localTimestamp = format.timestamp({
    format: () => {
        const now = new Date();

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

// Crea el logger con niveles personalizados y colores
const logger = createLogger({
    levels: customLevels.levels,
    level: "debug",
    format: format.combine(
        localTimestamp,
        format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
    ),
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/bot-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            maxFiles: "7d",
            zippedArchive: true
        }),
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.printf(
                    (info) => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`
                )
            )
        })
    ]
});

module.exports = logger;
