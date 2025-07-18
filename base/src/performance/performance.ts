import { performance } from "perf_hooks";
import { createLogger } from "../logger/logger";

export class Performance {
  private service: string;
  private start: number;

  constructor(service: string) {
    this.service = service;
    this.start = performance.now();
    createLogger().debug({ service: this.service, event: "start", start: this.start });
  }

  stop(): void {
    const end = performance.now();
    createLogger().debug({
      service: this.service,
      event: "end",
      duration: end - this.start,
      start: this.start,
      end
    });
  }
}
