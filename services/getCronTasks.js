const cronParser = require("cron-parser");
const moment = require("moment-timezone");
const cronJobs = require("../utils/cronJobs");
const logger = require("../utils/logger");
require("dotenv").config();

const getCronTasks = async () => {
    logger.title("Tareas cron activas/inactivas:");

    cronJobs.forEach((cronJob, index) => {
        const status = cronJob.task.options.scheduled ? "activo" : "detenido";
        const nextExecution = getNextExecutionTime(cronJob.pattern, cronJob.task.options.timezone);
        logger.info(
            `${index + 1}. ${
                cronJob.name
            } - Estado: ${status} - Próxima ejecución: ${nextExecution}`
        );
    });
};

// Función para obtener la próxima hora de ejecución
const getNextExecutionTime = (pattern, timezone) => {
    try {
        const interval = cronParser.parseExpression(pattern, { timezone });
        const nextExecution = interval.next().toDate();
        return moment(nextExecution).tz(timezone).format("DD-MM-YYYY HH:mm:ss");
    } catch (e) {
        logger.error(`Error al obtener la próxima ejecución: ${e}`);
        return "Error";
    }
};

module.exports = getCronTasks;
