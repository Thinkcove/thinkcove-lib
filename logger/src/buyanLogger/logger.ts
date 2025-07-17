import bunyan from "bunyan";
import bunyanFormat from "bunyan-format";
import { DEFAULT_LOGGER_MODE } from "../constant/loggerConstant";

// --- Type Inference Section ---

// Logger instance returned by bunyan.createLogger
type BunyanLogger = ReturnType<typeof bunyan.createLogger>;

// Options accepted by bunyan.createLogger
type BunyanLoggerOptions = Parameters<typeof bunyan.createLogger>[0];

// Options accepted by bunyan-format
type BunyanFormatOptions = Parameters<typeof bunyanFormat>[0];

/**
 * Configuration options for creating a formatted Bunyan logger.
 * Extends Bunyan's LoggerOptions except for `stream` and `streams`,
 * which are controlled internally through bunyan-format.
 */
export interface LoggerProps
  extends Omit<BunyanLoggerOptions, "stream" | "streams"> {
  /**
   * Optional bunyan-format configuration.
   * You can customize log format (e.g., 'short', 'long', etc.)
   */
  formatOptions?: BunyanFormatOptions;
}

/**
 * Creates a Bunyan logger instance with human-readable formatting.
 *
 * @param props - Bunyan logger configuration options and optional formatting.
 * @returns A configured and formatted Bunyan logger instance.
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
 * logger.info('Server started');
 * ```
 */
export const createLogger = ({
  name,
  level,
  serializers = bunyan.stdSerializers,
  src,
  formatOptions = {
    outputMode: DEFAULT_LOGGER_MODE,
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
