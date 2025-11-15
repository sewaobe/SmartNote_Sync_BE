import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getUserClasses, getClassById } from '../controller/ClassController.js';

const router = express.Router();

// Áp dụng middleware xác thực cho tất cả routes
router.use(authMiddleware);

// Lấy danh sách lớp của user (tự động tìm trong Teacher hoặc Student)
router.get('/', getUserClasses);

// Lấy chi tiết 1 lớp học (tự động kiểm tra quyền)
router.get('/:classId', getClassById);

export default router;
