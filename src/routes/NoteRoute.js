// routes/NoteRoute.js
import express from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  getNotesByOwner,
  updateNote,
  deleteNote,
  getNoteByOwnerIdAndLectureId,
} from '../controller/NoteController.js';
import { verifyToken } from '../middleware/jwt.middleware.js';

const router = express.Router();

// Create a new note
router.post('/', verifyToken, createNote);

// Get all notes
router.get('/', getAllNotes);

// Get notes by owner ID - MUST BE BEFORE /:noteId
router.get('/owner/:ownerId', getNotesByOwner);

// Get notes by owner ID - lecture ID
router.get('/lecture/:lectureId', verifyToken, getNoteByOwnerIdAndLectureId);

// Get note by ID
router.get('/:noteId', getNoteById);

// Update note
router.put('/:noteId', updateNote);

// Delete note
router.delete('/:noteId', deleteNote);

export default router;
