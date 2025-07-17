import bunyan, { LogLevelString } from "bunyan";
import bunyanFormat from "bunyan-format";
import {
  DEFAULT_LOGGER_MODE,
  DEFAULT_LOGGER_OUTPUT_MODE,
} from "../constant/loggerConstant";

// --- Inferred Types ---

// Logger instance returned by bunyan.createLogger
type BunyanLogger = ReturnType<typeof bunyan.createLogger>;

// Options accepted by bunyan.createLogger
type BunyanLoggerOptions = Parameters<typeof bunyan.createLogger>[0];

// Options accepted by bunyan-format
type BunyanFormatOptions = Parameters<typeof bunyanFormat>[0];

/**
 * Configuration options for creating a formatted Bunyan logger.
 * Extends Bunyan's LoggerOptions except for `stream` and `streams`,
 * which are handled internally by bunyan-format.
 */
export interface LoggerProps
  extends Omit<BunyanLoggerOptions, "stream" | "streams" | "level"> {
  /**
   * Minimum log level to output ("info", "debug", etc.)
   */
  level?: LogLevelString;

  /**
   * Optional bunyan-format config (outputMode, color, etc.)
   */
  formatOptions?: BunyanFormatOptions;
}

/**
 * Creates a Bunyan logger instance with human-readable formatting.
 *
 * @param props - Bunyan logger config with optional bunyan-format settings.
 * @returns A configured and formatted Bunyan logger.
 *
 * @example
 * ```ts
 * import { createLogger } from 'your-npm-package';
 *
 * const logger = createLogger({
 *   name: 'my-service',
 *   level: 'info',
 *   formatOptions: {
 *     outputMode: 'short',
 *     levelInString: true,
 *     color: true
 *   }
 * });
 *
 * logger.info('Service started');
 * ```
 */
export const createLogger = ({
  name,
  level = DEFAULT_LOGGER_MODE,
  serializers = bunyan.stdSerializers,
  src,
  formatOptions = {
    outputMode: DEFAULT_LOGGER_OUTPUT_MODE,
    levelInString: true,
  },
  ...rest
}: LoggerProps): BunyanLogger => {
  const loggerFormat = bunyanFormat(formatOptions);

  return bunyan.createLogger({
    name,
    level,
    serializers,
    stream: loggerFormat,
    src,
    ...rest,
  });
};
