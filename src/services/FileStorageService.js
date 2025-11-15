import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import { minioClient } from "../config/minio.config.js";

const BUCKET = "smartnote-sync";

class FileStorageService {
  async uploadFile(file) {
    try {
      const fileName = `${uuidv4()}_${file.originalname}`;
      const objectName = fileName;

      await minioClient.putObject(BUCKET, objectName, file.buffer, file.size, {
        "Content-Type": file.mimetype,
      });

      const publicUrl = `${MINIO_BASE_URL}/${BUCKET}/${objectName}`;
      return publicUrl;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw new Error("Error uploading file to MinIO");
    }
  }

  async uploadStream(inputStream, fileName) {
    try {
      const finalName = `${uuidv4()}_${fileName}`;
      const objectName = finalName;

      const contentType = mime.lookup(fileName) || "application/octet-stream";

      await minioClient.putObject(BUCKET, objectName, inputStream, undefined, {
        "Content-Type": contentType,
      });

      return objectName;
    } catch (err) {
      throw new Error("Error uploading stream to MinIO");
    }
  }

  async downloadFile(objectName) {
    try {
      return await minioClient.getObject(BUCKET, objectName);
    } catch (err) {
      throw new Error("Error downloading file");
    }
  }

  async deleteFile(objectName) {
    try {
      await minioClient.removeObject(BUCKET, objectName);
    } catch (err) {
      throw new Error("Error deleting file");
    }
  }

  async getPresignedUrl(objectName) {
    try {
      return await minioClient.presignedUrl(
        "GET",
        BUCKET,
        objectName,
        60 * 60 * 24 * 7
      );
    } catch (err) {
      console.error("Error generating presigned URL:", err);
      return null;
    }
  }
}

export default new FileStorageService();
