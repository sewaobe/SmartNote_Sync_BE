import express from 'express';
import multer from 'multer';
import {
  startTranscription,
  uploadAndTranscribe,
  getTranscriptsByLecture,
  updateCurrentPageIndex,
  getCurrentPageIndex,
} from '../controller/TranscriptionController.js';

const router = express.Router();
const upload = multer();

// Tạo transcript record trước
router.post('/start/:lectureId', startTranscription);

// Upload audio file và bắt đầu transcription
router.post('/upload/:transcriptId', upload.single('audio'), uploadAndTranscribe);

// Lấy tất cả transcripts của một lecture
router.get('/lecture/:lectureId', getTranscriptsByLecture);

// Update current page index của lecture
router.put('/:lectureId/currentPageIndex', updateCurrentPageIndex);

// Get current page index của lecture
router.get('/:lectureId/currentPageIndex', getCurrentPageIndex);

export default router;
