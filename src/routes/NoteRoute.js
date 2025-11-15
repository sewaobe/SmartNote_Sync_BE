// routes/NoteRoute.js
import express from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  getNotesByOwner,
  updateNote,
  deleteNote,
} from '../controller/NoteController.js';

const router = express.Router();

// Create a new note
router.post('/', createNote);

// Get all notes
router.get('/', getAllNotes);


// Get notes by owner ID - MUST BE BEFORE /:noteId
router.get('/owner/:ownerId', getNotesByOwner);

// Get note by ID
router.get('/:noteId', getNoteById);

// Update note
router.put('/:noteId', updateNote);

// Delete note
router.delete('/:noteId', deleteNote);

export default router;
