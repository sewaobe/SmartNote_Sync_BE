import express from "express";
import multer from "multer";
import {
  createLecture,
  deleteLecture,
  getLectureById,
  getLectures,
} from "../controller/LectureController.js";

const router = express.Router();

// cấu hình multer để nhận file PDF
const upload = multer({
  storage: multer.memoryStorage(),
});

// ------------------------------
// ROUTES
// ------------------------------

// Lấy tất cả lecture
router.get("/", getLectures);

// Lấy 1 lecture
router.get("/:id", getLectureById);

// Tạo lecture mới (có upload PDF)
router.post("/", upload.single("file"), createLecture);

// Xóa lecture
router.delete("/:id", deleteLecture);

export default router;
