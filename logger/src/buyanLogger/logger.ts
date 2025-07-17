import bunyan from "bunyan";
import bunyanFormat from "bunyan-format";

// Infer the type of the bunyan-format options
type BunyanFormatOptions = Parameters<typeof bunyanFormat>[0];

// Extract only valid output modes ("short", "bunyan", etc.)
type BunyanOutputMode = NonNullable<BunyanFormatOptions["outputMode"]>;

interface LoggerProps {
  name: string;
  logLevel: bunyan.LogLevelString;
  outputMode?: BunyanOutputMode;
}

/**
 * Creates a Bunyan logger with formatted output.
 *
 * @param name - Name of the logger (usually your app or service name)
 * @param logLevel - Minimum log level to output (e.g., "info", "debug", "error")
 * @param outputMode - Format of the logs (e.g., "short", "long", "json", "bunyan")
 * @returns A configured Bunyan logger instance
 *
 * @example
 * ```ts
 * import { createLogger } from 'your-npm-package';
 *
 * const logger = createLogger({
 *   name: 'my-service',
 *   logLevel: 'info',
 *   outputMode: 'short', // optional (default is "bunyan")
 * });
 *
 * logger.info('Service started successfully');
 * ```
 */
export const createLogger = ({
  name,
  logLevel,
  outputMode = "bunyan",
}: LoggerProps) => {
  const loggerFormat = bunyanFormat({
    outputMode,
    levelInString: true,
  });

  return bunyan.createLogger({
    name,
    stream: loggerFormat,
    level: logLevel,
    serializers: bunyan.stdSerializers,
  });
};
