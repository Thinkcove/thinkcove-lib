import winston from "winston";
import { DEFAULT_LEVEL, DEFAULT_COMBINED_LOG_PATH, DEFAULT_LOG_PATH } from "./constant";

export interface LoggerOptions extends Partial<winston.LoggerOptions> {
  enableConsole?: boolean;
  errorLogPath?: string;
  combinedLogPath?: string;
  use12HourFormat?: boolean;
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
  use12HourFormat = false,
  ...rest
}: LoggerOptions = {}) => {
  const timeFormat = use12HourFormat ? "YYYY-MM-DD hh:mm:ss A" : "YYYY-MM-DD HH:mm:ss";

  // Format message with timestamp, level, message, and optional metadata
  const formatter = winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const msg = typeof message === "object" ? JSON.stringify(message) : String(message);
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level}: ${msg}${metaStr}`;
  });

  const baseFormat = winston.format.combine(
    winston.format.timestamp({ format: timeFormat }),
    winston.format.errors({ stack: true }),
    winston.format.splat()
  );

  const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: timeFormat }),
    winston.format.colorize({ all: true }),
    formatter
  );

  const fileFormat = winston.format.combine(baseFormat, formatter);

  const resolvedTransports: winston.transport[] =
    Array.isArray(transports) && transports.length > 0
      ? transports
      : [
          ...(enableConsole
            ? [
                new winston.transports.Console({
                  format: consoleFormat
                })
              ]
            : []),
          new winston.transports.File({
            filename: errorLogPath,
            level: "error",
            format: fileFormat
          }),
          new winston.transports.File({
            filename: combinedLogPath,
            format: fileFormat
          })
        ];

  return winston.createLogger({
    level,
    format: format ?? baseFormat,
    transports: resolvedTransports,
    ...rest
  });
};
