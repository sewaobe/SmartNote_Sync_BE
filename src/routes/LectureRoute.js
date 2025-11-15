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

// Tạo lecture mới (có upload PDF) - classId từ URL
// PHẢI ĐẶT TRƯỚC route /:id để tránh conflict
router.post("/create/:classId", upload.single("file"), createLecture);

// Lấy 1 lecture (PHẢI SAU create route)
router.get("/:id", getLectureById);

// Xóa lecture
router.delete("/:id", deleteLecture);

export default router;
