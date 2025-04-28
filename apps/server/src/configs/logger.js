import pino from "pino";

const logger = pino({
  transport: {
    target: "pino/file",
    options: {
      destination: "./logs/combined.log",
      append: true,
      mkdir: true,
    },
  },
});

export { logger };
