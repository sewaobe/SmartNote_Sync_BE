import express from "express";
import multer from "multer";
import {
  createLecture,
  deleteLecture,
  getLectureById,
  getLectures,
  getLecturesByClass,
} from "../controller/LectureController.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();

// cấu hình multer để nhận file PDF
const upload = multer({
  storage: multer.memoryStorage(),
});

// ------------------------------
// ROUTES
// ------------------------------

// Lấy tất cả lecture (không cần auth)
router.get("/", getLectures);

// Lấy lectures của 1 class (cần JWT auth + authorization)
router.get("/class/:classId", verifyToken, getLecturesByClass);

// Tạo lecture mới (có upload PDF) - classId từ URL
// PHẢI ĐẶT TRƯỚC route /:id để tránh conflict
router.post("/create/:classId", upload.single("file"), createLecture);

// Lấy 1 lecture (PHẢI SAU create route)
router.get("/:id", getLectureById);

// Xóa lecture
router.delete("/:id", deleteLecture);

export default router;
