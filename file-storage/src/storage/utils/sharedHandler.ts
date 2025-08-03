import path from "path";
import { contentToBuffer, detectMimeTypeAndExtension, generateFileName } from "./utils";
import {
  FileMetadata,
  GetFileResult,
  StorageBackend,
  UploadableContent,
  UploadFileResult
} from "../types/sharedStorage";

export async function handleUploadGeneric(
  backend: StorageBackend,
  destinationPath: string,
  content: UploadableContent,
  metadata?: Partial<FileMetadata>,
  fileName?: string
): Promise<UploadFileResult> {
  const buffer = contentToBuffer(content);
  const { mimeType, extension } = await detectMimeTypeAndExtension(buffer);
  const finalFileName = fileName ?? generateFileName();

  const fullMetadata: FileMetadata = {
    ...metadata,
    extension,
    mimeType,
    size: buffer.length,
    uploadedAt: new Date().toISOString()
  };

  const fullPath = path.posix.join(destinationPath, finalFileName);

  await backend.writeFile(buffer, fullPath, fullMetadata);
  const url = await backend.generateUrl(fullPath);

  return {
    fileName: finalFileName,
    url,
    metadata: fullMetadata
  };
}

export async function handleGetFileGeneric(
  backend: StorageBackend,
  pathStr: string,
  includeMetadata: boolean = false,
  expiresIn: number = 3600
): Promise<GetFileResult> {
  const { metadata, mimeType, size } = await backend.readFile(pathStr);
  const url = await backend.generateUrl(pathStr, { expiresIn });

  return {
    url,
    mimeType,
    size,
    metadata: includeMetadata ? metadata : undefined
  };
}

export async function getDownloadUrlGeneric(
  backend: StorageBackend,
  destinationPath: string,
  fileName?: string,
  expiresIn = 3600
): Promise<string> {
  return backend.generateUrl(destinationPath, {
    expiresIn,
    download: true,
    fileName
  });
}

export async function getPreviewUrlGeneric(
  backend: StorageBackend,
  destinationPath: string,
  expiresIn = 3600
): Promise<string> {
  return backend.generateUrl(destinationPath, { expiresIn });
}

export async function handleDeleteGeneric(
  backend: StorageBackend,
  destinationPath: string
): Promise<void> {
  await backend.deleteFile(destinationPath);
}
