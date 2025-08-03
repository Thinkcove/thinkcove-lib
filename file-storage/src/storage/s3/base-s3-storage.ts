import {
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileMetadata, StorageBackend, StorageUrlOptions } from "../types/sharedStorage";
import { encodeMetadata, decodeMetadata, streamToBuffer } from "../utils/utils";
import { Readable } from "stream";

export class BaseS3Storage implements StorageBackend {
  constructor(
    protected readonly s3: S3Client,
    protected readonly bucket: string
  ) {
    if (!bucket) throw new Error("S3 bucket name is required.");
  }

  async writeFile(buffer: Buffer, path: string, metadata: FileMetadata): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: path,
        Body: buffer,
        ContentType: metadata.mimeType,
        Metadata: encodeMetadata(metadata)
      })
    );
  }

  async readFile(path: string): Promise<{
    buffer: Buffer;
    metadata: FileMetadata;
    mimeType: string;
    size: number;
  }> {
    const head = await this.s3.send(new HeadObjectCommand({ Bucket: this.bucket, Key: path }));

    const getObject = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: path }));

    const stream = getObject.Body as Readable;
    const buffer = await streamToBuffer(stream);

    const metadata = decodeMetadata(head.Metadata);
    const mimeType = head.ContentType ?? "application/octet-stream";
    const size = head.ContentLength ?? buffer.length;

    return {
      buffer,
      metadata,
      mimeType,
      size
    };
  }

  async deleteFile(path: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: path }));
  }

  async generateUrl(path: string, options?: StorageUrlOptions): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: path,
      ...(options?.download
        ? { ResponseContentDisposition: `attachment; filename="${options.fileName}"` }
        : {})
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: options?.expiresIn ?? 3600
    });
  }
}
