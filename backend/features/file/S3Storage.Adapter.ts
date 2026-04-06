import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import type { FileStorageAdapter, UploadResult } from './FileStorage.Adapter';

export class S3StorageAdapter implements FileStorageAdapter {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? '';
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? '';
    this.bucket = process.env.R2_BUCKET_NAME ?? '';
    this.publicUrl = process.env.R2_PUBLIC_URL ?? '';

    this.client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ROUTE ?? '',
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async upload(buffer: Buffer, key: string, contentType: string): Promise<UploadResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return {
      fileId: key,
      fileUrl: `${this.publicUrl}/${this.bucket}/${key.split('/').map(encodeURIComponent).join('/')}`,
    };
  }

  async delete(fileId: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileId,
      }),
    );
  }
}
