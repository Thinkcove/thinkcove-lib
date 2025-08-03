import { BaseLocalStorage } from "./base-local-storage";
import { LocalFileStorageOptions } from "../types/sharedStorage";

import { GenericStorageService } from "../utils/storageService";

export class LocalStorageService extends GenericStorageService {
  storageBackend: BaseLocalStorage;

  constructor(
    config: Required<Pick<LocalFileStorageOptions, "baseDirectory" | "isLocal">> &
      Partial<LocalFileStorageOptions>
  ) {
    super();
    this.storageBackend = new BaseLocalStorage(config);
  }
}
