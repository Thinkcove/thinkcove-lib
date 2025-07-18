import winston from "winston";

/**
 * Creates a Winston logger instance with the specified log level.
 *
 * @param level - The minimum level of messages that this logger should log.
 *                Common levels: 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
 *                Default is 'info'.
 *
 * @returns A configured Winston logger instance.
 *
 * @example
 * const logger = createLogger('debug');
 * logger.info('Application started');
 * logger.error('An error occurred');
 */
export const createLogger = (level: string = "info") => {
  return winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    ),
    transports: [
      // Logs all levels to the console
      new winston.transports.Console(),

      // Logs only 'error' level messages to logs/error.log
      new winston.transports.File({ filename: "logs/error.log", level: "error" }),

      // Logs all messages of level >= specified `level` to logs/combined.log
      new winston.transports.File({ filename: "logs/combined.log" })
    ]
  });
};
