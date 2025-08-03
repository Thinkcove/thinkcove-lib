import {
  FileStorageProvider,
  CreateFileParams,
  UpdateFileParams,
  GetFileParams,
  UploadFileResult,
  GetFileResult,
  StorageBackend
} from "../types/sharedStorage";

import {
  handleUploadGeneric,
  handleGetFileGeneric,
  getDownloadUrlGeneric,
  getPreviewUrlGeneric,
  handleDeleteGeneric
} from "./sharedHandler";

export abstract class GenericStorageService implements FileStorageProvider {
  abstract storageBackend: StorageBackend;

  async uploadFile(params: CreateFileParams): Promise<UploadFileResult> {
    return handleUploadGeneric(
      this.storageBackend,
      params.destinationPath,
      params.content,
      params.metadata
    );
  }

  async updateFile(params: UpdateFileParams): Promise<UploadFileResult> {
    return handleUploadGeneric(
      this.storageBackend,
      params.destinationPath,
      params.content,
      params.metadata,
      params.fileName
    );
  }

  async getFile(params: GetFileParams): Promise<GetFileResult> {
    return handleGetFileGeneric(
      this.storageBackend,
      params.destinationPath,
      params.includeMetadata,
      params.expiresIn
    );
  }

  async getPreviewUrl(destinationPath: string, expiresIn = 3600): Promise<string> {
    return getPreviewUrlGeneric(this.storageBackend, destinationPath, expiresIn);
  }

  async getDownloadUrl(
    destinationPath: string,
    expiresIn = 3600,
    fileName?: string
  ): Promise<string> {
    return getDownloadUrlGeneric(this.storageBackend, destinationPath, fileName, expiresIn);
  }

  async deleteFile(destinationPath: string): Promise<void> {
    return handleDeleteGeneric(this.storageBackend, destinationPath);
  }
}
