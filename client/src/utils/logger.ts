type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const DEFAULT_LEVEL: LogLevel = import.meta.env.PROD ? "warn" : "debug";
const CONFIGURED_LEVEL = (import.meta.env.VITE_LOG_LEVEL as LogLevel | undefined) || DEFAULT_LEVEL;

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[CONFIGURED_LEVEL];
};

const normalizeContext = (context: unknown): unknown => {
  if (context instanceof Error) {
    return {
      name: context.name,
      message: context.message,
      stack: import.meta.env.DEV ? context.stack : undefined,
    };
  }

  if (typeof context === "object" && context !== null) {
    return context;
  }

  return { value: context };
};

const writeLog = (level: LogLevel, message: string, context?: unknown): void => {
  if (!shouldLog(level)) {
    return;
  }

  const prefix = `[client][${level}] ${message}`;
  const normalizedContext = context === undefined ? undefined : normalizeContext(context);

  const logMethod =
    level === "error"
      ? console.error
      : level === "warn"
        ? console.warn
        : level === "info"
          ? console.info
          : console.debug;

  if (normalizedContext === undefined) {
    logMethod(prefix);
    return;
  }

  logMethod(prefix, normalizedContext);
};

export const logger = {
  debug: (message: string, context?: unknown): void => writeLog("debug", message, context),
  info: (message: string, context?: unknown): void => writeLog("info", message, context),
  warn: (message: string, context?: unknown): void => writeLog("warn", message, context),
  error: (message: string, context?: unknown): void => writeLog("error", message, context),
};
