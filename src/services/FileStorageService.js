import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, AWS_BUCKET } from "../config/minio.config.js";

class FileStorageService {
  async uploadFile(file) {
    try {
      const fileName = `${uuidv4()}_${file.originalname}`;
      const objectName = fileName;

      await s3Client.send(new PutObjectCommand({
        Bucket: AWS_BUCKET,
        Key: objectName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));

      return objectName;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw new Error("Error uploading file to S3");
    }
  }

  async uploadStream(inputStream, fileName) {
    try {
      const finalName = `${uuidv4()}_${fileName}`;
      const objectName = finalName;

      const contentType = mime.lookup(fileName) || "application/octet-stream";

      await s3Client.send(new PutObjectCommand({
        Bucket: AWS_BUCKET,
        Key: objectName,
        Body: inputStream,
        ContentType: contentType,
      }));

      return objectName;
    } catch (err) {
      throw new Error("Error uploading stream to S3");
    }
  }

  async downloadFile(objectName) {
    try {
      return await s3Client.send(new GetObjectCommand({
        Bucket: AWS_BUCKET,
        Key: objectName,
      }));
    } catch (err) {
      throw new Error("Error downloading file");
    }
  }

  async deleteFile(objectName) {
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: AWS_BUCKET,
        Key: objectName,
      }));
    } catch (err) {
      throw new Error("Error deleting file");
    }
  }

  async getPresignedUrl(objectName) {
    try {
      return await getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: AWS_BUCKET,
        Key: objectName,
      }), { expiresIn: 60 * 60 * 24 * 7 });
    } catch (err) {
      console.error("Error generating presigned URL:", err);
      return null;
    }
  }
}

export default new FileStorageService();
