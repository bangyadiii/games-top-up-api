const logger = require("pino");
const dayjs = require("dayjs");
const log = logger({
    base: {
        pid: false,
    },
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },

    timestamp: () => `, "time" : "${dayjs().format("YYYY-MM-DD HH:mm:ss")}"`,
});

module.exports = log;
