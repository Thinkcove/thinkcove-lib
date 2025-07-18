import { createLogger } from "../logger/logger";

/**
 * Creates a performance tracker for logging "start" and "end" events.
 *
 * @param service - A label identifying the service or operation being tracked.
 * @returns An object with a `stop()` method to log the end of the operation.
 *
 * Usage:
 * const perf = performanceTracker("user-auth");
 * // ... perform some actions
 * perf.stop(); // logs the "end" event
 */
export const performance = (service: string) => {
  // Log the start of the operation
  createLogger().info({ service, event: "start" });

  return {
    // Call this to log the end of the operation
    stop: () => {
      createLogger().info({ service, event: "end" });
    }
  };
};
