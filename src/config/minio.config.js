import { Client as MinioClient } from "minio";
import dotenv from "dotenv";
dotenv.config();
console.log("MINIO ENDPOINT =", process.env.MINIO_ENDPOINT);
export const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT) || 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Public base URL
export const MINIO_BASE_URL = process.env.MINIO_BASE_URL;
