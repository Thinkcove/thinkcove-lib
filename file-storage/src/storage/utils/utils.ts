import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import path from "path";
import { Readable } from "stream";
import { FileMetadata, UploadableContent } from "../types/sharedStorage";

export function encodeMetadata(meta?: FileMetadata): Record<string, string> | undefined {
  if (!meta) return undefined;
  const encoded: Record<string, string> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (value != null) {
      encoded[key.toLowerCase()] = typeof value === "string" ? value : JSON.stringify(value);
    }
  }
  return encoded;
}

export function decodeMetadata(meta?: Record<string, string>): FileMetadata {
  const decoded: FileMetadata = {};
  for (const [key, value] of Object.entries(meta || {})) {
    try {
      decoded[key] = JSON.parse(value);
    } catch {
      decoded[key] = value;
    }
  }
  return decoded;
}

export function generateUniqueId(length = 12): string {
  // Generates a random hex string of given length (default 16 bytes = 32 hex chars)
  return crypto.randomBytes(length).toString("hex");
}

export function generateFileName(): string {
  const uniqueId = generateUniqueId(12); // 24 hex chars
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  return `${uniqueId}-${date}`;
}

export function contentToBuffer(content: UploadableContent): Buffer {
  if (Buffer.isBuffer(content)) return content;
  if (content instanceof Uint8Array) return Buffer.from(content);
  if (typeof content === "string") return Buffer.from(content, "utf-8");
  throw new Error("Unsupported content type");
}
export function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export async function detectMimeTypeAndExtension(buffer: Buffer): Promise<{
  mimeType: string;
  extension?: string;
}> {
  const type = await fileTypeFromBuffer(buffer);
  return {
    mimeType: type?.mime || "application/octet-stream",
    extension: type?.ext
  };
}

export function sanitizePath(filePath: string): string {
  const normalized = path.normalize(filePath);
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
    throw new Error("Invalid destination path");
  }
  return normalized;
}
