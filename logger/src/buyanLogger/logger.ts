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
