import { performance } from "perf_hooks";
// TODO - Uncomment the logger line when logger is available

// import { logger } from "@thinkcove-lib/logger";

export class Performance {
  private service: string;
  private start: number;

  constructor(service: string) {
    this.service = service;
    this.start = performance.now();
    // TODO - Uncomment the logger line when logger is available
    // logger.debug({ service: this.service, event: "start", start: this.start });
  }

  stop(): void {
    const end = performance.now();
    // TODO - Uncomment the logger line when logger is available
    // logger.debug({
    //   service: this.service,
    //   event: "end",
    //   duration: end - this.start,
    //   start: this.start,
    //   end,
    // });
  }
}
