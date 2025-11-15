import express from 'express';
import { login, getCurrentUser } from '../controller/AuthController.js';
import { verifyToken } from '../middleware/jwt.middleware.js';

const router = express.Router();

// Login - không cần JWT
router.post('/login', login);

// Get current user - cần JWT
router.get('/me', verifyToken, getCurrentUser);

export default router;
