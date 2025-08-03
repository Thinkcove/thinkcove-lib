export type UploadableContent = string | Buffer | Uint8Array | ArrayBuffer;

export interface FileMetadata {
  mimeType?: string;
  extension?: string;
  size?: number;
  uploadedAt?: string;
  lastModified?: string;
  [key: string]: any;
}

interface BaseFileParams {
  destinationPath: string;
  content: UploadableContent;
  metadata?: Partial<FileMetadata>;
}

export type CreateFileParams = BaseFileParams;

export interface UpdateFileParams extends BaseFileParams {
  fileName: string;
  isUpdate: boolean;
}

export interface UploadFileResult {
  fileName: string;
  url: string;
  metadata: FileMetadata;
}

export interface GetFileParams {
  destinationPath: string;
  includeMetadata?: boolean;
  expiresIn?: number;
}

export interface GetFileResult {
  url: string;
  mimeType: string;
  size: number;
  metadata?: FileMetadata;
}

// Storage config
export interface LocalFileStorageOptions {
  baseDirectory: string;
  isLocal: boolean;
  publicBaseUrl?: string;
  publicPathPrefix?: string;
}

// Final storage provider interface
export interface FileStorageProvider {
  uploadFile(params: CreateFileParams): Promise<UploadFileResult>;
  updateFile(params: UpdateFileParams): Promise<UploadFileResult>;
  getFile(params: GetFileParams): Promise<GetFileResult>;
  deleteFile(destinationPath: string): Promise<void>;
}

export interface StorageUrlOptions {
  expiresIn?: number;
  download?: boolean;
  fileName?: string;
}

export interface StorageBackend {
  writeFile(buffer: Buffer, path: string, metadata: FileMetadata): Promise<void>;
  readFile(
    path: string
  ): Promise<{ buffer: Buffer; metadata: FileMetadata; mimeType: string; size: number }>;
  deleteFile(path: string): Promise<void>;
  generateUrl(path: string, options?: StorageUrlOptions): Promise<string>;
}

export interface S3StorageOptions {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  bucket: string;
}
