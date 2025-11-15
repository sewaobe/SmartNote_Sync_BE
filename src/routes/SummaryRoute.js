// routes/SummaryRoute.js
import express from 'express';
import {
  generateSummary,
  getSummaryByLecture,
  getAllSummaries,
  getSummaryById,
  deleteSummary,
} from '../controller/SummaryController.js';
import { verifyToken } from '../middleware/jwt.middleware.js';

const router = express.Router();

router.post('/generate', verifyToken, generateSummary);
router.get('/', getAllSummaries);
router.get('/lecture/:lectureId', getSummaryByLecture);
router.get('/:summaryId', getSummaryById);
router.delete('/:summaryId', deleteSummary);

export default router;
