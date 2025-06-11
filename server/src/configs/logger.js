import pino from "pino";

// export const logger = pino({
//   transport: {
//     target: "pino/file",
//     options: {
//       destination: "./logs/combined.log",
//       append: true,
//       mkdir: true,
//     },
//   },
//   timestamp: pino.stdTimeFunctions.isoTime,
// });

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      destination: 1,
    },
  },
});
