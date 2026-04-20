import pino, { LoggerOptions } from "pino";

const isProduction = process.env.NODE_ENV === "production";
const configuredLevel = process.env.LOG_LEVEL;

const options: LoggerOptions = {
  level: configuredLevel || (isProduction ? "info" : "debug"),
  redact: {
    paths: ["authorization", "token", "password", "confirmPassword", "req.headers.authorization"],
    remove: true,
  },
  base: {
    service: "devconnector-api",
    env: process.env.NODE_ENV || "development",
  },
};

if (!isProduction && process.stdout.isTTY) {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  };
}

const logger = pino(options);

export const withContext = (context: Record<string, unknown>) => logger.child(context);

export default logger;
