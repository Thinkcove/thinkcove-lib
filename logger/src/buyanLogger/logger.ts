import bunyan from "bunyan";
import bunyanFormat from "bunyan-format";
import type { LogLevelString } from "bunyan";
import {
  DEFAULT_LOGGER_OUTPUT_MODE,
  DEFAULT_LOGGER_LEVEL,
} from "../constant/loggerConstant";

// Inferred types
type BunyanLogger = ReturnType<typeof bunyan.createLogger>;
type BunyanLoggerOptions = Parameters<typeof bunyan.createLogger>[0];
type BunyanFormatOptions = Parameters<typeof bunyanFormat>[0];

export interface LoggerProps
  extends Omit<BunyanLoggerOptions, "stream" | "streams" | "level"> {
  level?: LogLevelString;
  formatOptions?: BunyanFormatOptions;
}

/**
 * Creates a Bunyan logger instance with bunyan-format formatting.
 *
 * @param props - Logger configuration
 * @returns A formatted Bunyan logger
 */
export const createLogger = ({
  name,
  level = DEFAULT_LOGGER_LEVEL,
  serializers = bunyan.stdSerializers,
  src,
  formatOptions = {
    outputMode: DEFAULT_LOGGER_OUTPUT_MODE,
    levelInString: true,
    color: true,
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
