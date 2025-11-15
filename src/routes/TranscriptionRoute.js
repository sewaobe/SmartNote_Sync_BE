import express from 'express';
import multer from 'multer';
import {
  uploadAndTranscribe,
  getTranscriptsByLecture,
} from '../controller/TranscriptionController.js';

const router = express.Router();
const upload = multer();

// Upload audio và bắt đầu transcription
router.post(
  '/upload/:lectureId',
  upload.single('audio'),
  uploadAndTranscribe,
);

// Lấy tất cả transcripts của một lecture
router.get('/lecture/:lectureId', getTranscriptsByLecture);

export default router;
