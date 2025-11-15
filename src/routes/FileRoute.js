import express from "express";
import multer from "multer";
import {
  getPresignedUrl,
  uploadFile,
} from "../controller/FileStorageController.js";

const router = express.Router();
const upload = multer(); // upload memory storage

router.post("/upload", upload.single("file"), uploadFile);
router.get("/presigned/:bucket/:key", getPresignedUrl);

export default router;
