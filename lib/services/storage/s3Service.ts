import { 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_CONFIG } from '@/utils/awsConfig';

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read';
}

export interface FileMetadata {
  key: string;
  size: number;
  lastModified: Date;
  contentType?: string;
  url: string;
}

export class S3Service {
  private bucket: string;

  constructor() {
    this.bucket = S3_CONFIG.BUCKET_NAME;
  }

  async uploadFile(
    key: string, 
    content: Buffer | string, 
    options: UploadOptions = {}
  ): Promise<FileMetadata> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: content,
      ContentType: options.contentType || 'application/octet-stream',
      Metadata: options.metadata,
      ACL: options.acl || 'private'
    });

    await s3Client.send(command);

    const metadata = await this.getFileMetadata(key);
    return metadata;
  }

  async uploadCodeArchive(
    projectId: string,
    codeGenId: string,
    zipBuffer: Buffer
  ): Promise<FileMetadata> {
    const key = `code-generations/${projectId}/${codeGenId}/archive.zip`;
    return await this.uploadFile(key, zipBuffer, {
      contentType: 'application/zip',
      metadata: {
        projectId,
        codeGenId,
        type: 'code-archive'
      }
    });
  }

  async uploadArchitectureDiagram(
    projectId: string,
    architectureId: string,
    imageBuffer: Buffer,
    contentType: string
  ): Promise<FileMetadata> {
    const extension = contentType.split('/')[1] || 'png';
    const key = `architectures/${projectId}/${architectureId}/diagram.${extension}`;
    return await this.uploadFile(key, imageBuffer, {
      contentType,
      metadata: {
        projectId,
        architectureId,
        type: 'architecture-diagram'
      }
    });
  }

  async downloadFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      throw new Error('File not found or empty');
    }

    return Buffer.from(await response.Body.transformToByteArray());
  }

  async getFileMetadata(key: string): Promise<FileMetadata> {
    const command = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    const response = await s3Client.send(command);

    return {
      key,
      size: response.ContentLength || 0,
      lastModified: response.LastModified || new Date(),
      contentType: response.ContentType,
      url: `s3://${this.bucket}/${key}`
    };
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    await s3Client.send(command);
  }

  async listFiles(prefix: string, maxKeys: number = 100): Promise<FileMetadata[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
      MaxKeys: maxKeys
    });

    const response = await s3Client.send(command);
    const files: FileMetadata[] = [];

    if (response.Contents) {
      for (const item of response.Contents) {
        if (item.Key) {
          files.push({
            key: item.Key,
            size: item.Size || 0,
            lastModified: item.LastModified || new Date(),
            url: `s3://${this.bucket}/${item.Key}`
          });
        }
      }
    }

    return files;
  }

  async generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  async generateUploadUrl(
    key: string, 
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.getFileMetadata(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${S3_CONFIG.BUCKET_REGION}.amazonaws.com/${key}`;
  }
}
