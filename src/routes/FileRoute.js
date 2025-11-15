import express from "express";
import multer from "multer";
import {
  getPresignedUrl,
  uploadFile,
} from "../controller/FileStorageController.js";
import {
  uploadClassFile,
  getClassFiles,
} from "../controller/ClassFileController.js";

const router = express.Router();
const upload = multer(); // upload memory storage

router.post("/upload", upload.single("file"), uploadFile);
router.get("/presigned/:key", getPresignedUrl);

// Class file routes
router.post("/class/:classId/upload", upload.single("file"), uploadClassFile);
router.get("/class/:classId/files", getClassFiles);

export default router;
