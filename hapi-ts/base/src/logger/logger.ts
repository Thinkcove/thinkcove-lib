import winston from "winston";
import { DEFAULT_LEVEL, DEFAULT_COMBINED_LOG_PATH, DEFAULT_LOG_PATH } from "./constant";

export interface LoggerOptions extends Partial<winston.LoggerOptions> {
  enableConsole?: boolean;
  errorLogPath?: string;
  combinedLogPath?: string;
}
/**
 * Creates a Winston logger with optional console and file logging.
 *
 * This utility wraps Winston’s logger creation in a simplified API that:
 * - Enables console logging by default.
 * - Writes error-level logs to a file.
 * - Writes all logs (>= configured level) to a combined file.
 * - Allows overriding any core Winston options (e.g., `defaultMeta`, `exitOnError`, `handleExceptions`, etc.).
 *
 * ### Default Behavior
 * - Log level: `info`
 * - Console logging: Enabled
 * - Error log file: `logs/error.log`
 * - Combined log file: `logs/combined.log`
 *
 * ### Custom Options
 * | Option            | Description                                                    |
 * |-------------------|----------------------------------------------------------------|
 * | `level`           | Minimum log level to log (e.g., 'debug', 'info', 'error')      |
 * | `enableConsole`   | Whether to log to the console (default: `true`)                |
 * | `errorLogPath`    | File path for logging errors (default: `logs/error.log`)       |
 * | `combinedLogPath` | File path for all logs (default: `logs/combined.log`)          |
 * | `format`          | Optional Winston format override                               |
 * | `transports`      | Optional custom transport array (overrides `enableConsole`, etc.) |
 * | ...rest           | Any other valid Winston.LoggerOptions props                    |
 *
 * ### Example: Basic Usage
 * ```ts
 * const logger = createLogger();
 * logger.info("App started");
 * ```
 *
 * ### Example: Advanced Usage
 * ```ts
 * const logger = createLogger({
 *   level: "debug",
 *   enableConsole: false,
 *   errorLogPath: "logs/errors.log",
 *   combinedLogPath: "logs/all.log",
 *   defaultMeta: { service: "auth-service" },
 *   handleExceptions: true,
 *   exitOnError: false
 * });
 * ```
 *
 * @param options - Logger configuration (custom and standard Winston options)
 * @returns A configured Winston logger
 */
export const createLogger = ({
  level = DEFAULT_LEVEL,
  enableConsole = true,
  errorLogPath = DEFAULT_LOG_PATH,
  combinedLogPath = DEFAULT_COMBINED_LOG_PATH,
  format,
  transports,
  ...rest
}: LoggerOptions = {}) => {
  const logFormat =
    format ??
    winston.format.combine(
      winston.format.splat(),
      winston.format.json(),
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const msg = typeof message === "object" ? JSON.stringify(message) : String(message);

        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";

        return `[${timestamp}] ${level.toUpperCase()}: ${msg}${metaStr}`;
      })
    );

  const resolvedTransports =
    Array.isArray(transports) && transports.length > 0
      ? transports
      : [
          ...(enableConsole ? [new winston.transports.Console()] : []),
          new winston.transports.File({ filename: errorLogPath, level: "error" }),
          new winston.transports.File({ filename: combinedLogPath })
        ];

  return winston.createLogger({
    level,
    format: logFormat,
    transports: resolvedTransports,
    ...rest
  });
};
