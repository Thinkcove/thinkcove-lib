import path from "path";
import fs from "fs/promises";
import { FileMetadata, StorageBackend, LocalFileStorageOptions } from "../types/sharedStorage";
import {
  sanitizePath,
  encodeMetadata,
  decodeMetadata,
  detectMimeTypeAndExtension
} from "../utils/utils";

export class BaseLocalStorage implements StorageBackend {
  constructor(
    private readonly config: Required<Pick<LocalFileStorageOptions, "baseDirectory" | "isLocal">> &
      Partial<LocalFileStorageOptions>
  ) {
    if (!config.baseDirectory) {
      throw new Error("Base directory is required.");
    }
    if (!config.isLocal && !config.publicBaseUrl)
      throw new Error("publicBaseUrl is required for non-local storage.");
  }

  protected resolveFilePath(destinationPath: string): string {
    return path.resolve(this.config.baseDirectory, sanitizePath(destinationPath));
  }

  protected getRelativePublicPath(destinationPath: string): string {
    const cleanPath = sanitizePath(destinationPath);
    const prefix = this.config.publicPathPrefix?.replace(/^\/|\/$/g, "") ?? "";
    return prefix ? `${prefix}/${cleanPath}` : cleanPath;
  }

  protected getMetaFilePath(filePath: string): string {
    return `${filePath}.meta.json`;
  }

  protected async ensureDirForFile(filePath: string) {
    const dir = path.dirname(filePath);
    // create a folder initially once hit ensureDirForFile function, if the folder is not in specified path
    await fs.mkdir(dir, { recursive: true });
  }

  // check file exists
  protected async fileExists(filePath: string) {
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`File not found: ${filePath}`);
    }
  }

  async writeFile(buffer: Buffer, destinationPath: string, metadata: FileMetadata): Promise<void> {
    const filePath = this.resolveFilePath(destinationPath);
    await this.ensureDirForFile(filePath);
    await fs.writeFile(filePath, buffer);

    const metaPath = this.getMetaFilePath(filePath);
    await fs.writeFile(metaPath, JSON.stringify(encodeMetadata(metadata), null, 2));
  }

  async readFile(destinationPath: string): Promise<{
    buffer: Buffer;
    metadata: FileMetadata;
    mimeType: string;
    size: number;
  }> {
    const filePath = this.resolveFilePath(destinationPath);
    await this.fileExists(filePath);

    const buffer = await fs.readFile(filePath);
    const stats = await fs.stat(filePath);
    const size = stats?.size ?? null;
    
    const { mimeType, extension } = await detectMimeTypeAndExtension(buffer);

    const metaPath = this.getMetaFilePath(filePath);
    let metadata: FileMetadata = {
      mimeType,
      extension,
      size,
      lastModified: stats.mtime.toISOString()
    };

    try {
      const metaRaw = await fs.readFile(metaPath, "utf-8");
      metadata = {
        ...metadata,
        ...decodeMetadata(JSON.parse(metaRaw))
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    return {
      buffer,
      metadata,
      mimeType,
      size
    };
  }

  async deleteFile(destinationPath: string): Promise<void> {
    const filePath = this.resolveFilePath(destinationPath);
    const metaPath = this.getMetaFilePath(filePath);

    await Promise.all([
      fs.unlink(filePath).catch((e) => {
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
      }),
      fs.unlink(metaPath).catch((e) => {
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
      })
    ]);
  }

  async generateUrl(destinationPath: string): Promise<string> {
    const relPath = this.getRelativePublicPath(destinationPath);

    if (this.config.isLocal) {
      return `file:///${this.resolveFilePath(destinationPath).replace(/\\/g, "/")}`;
    }

    if (!this.config.publicBaseUrl) {
      throw new Error("Missing publicBaseUrl for remote storage");
    }

    return `${this.config.publicBaseUrl}/${relPath.replace(/\\/g, "/")}`;
  }
}
