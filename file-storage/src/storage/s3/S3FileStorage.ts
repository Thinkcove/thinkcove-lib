import { S3Client } from "@aws-sdk/client-s3";
import { BaseS3Storage } from "./base-s3-storage";
import { GenericStorageService } from "../utils/storageService";
import { S3StorageOptions } from "../types/sharedStorage";

export class S3StorageService extends GenericStorageService {
  storageBackend: BaseS3Storage;

  constructor(config: S3StorageOptions) {
    super();

    const s3Client = new S3Client({
      region: config.region,
      credentials: config.credentials
    });

    this.storageBackend = new BaseS3Storage(s3Client, config.bucket);
  }
}
