// controllers/NoteController.js
import {
  createNote as createNoteService,
  getAllNotes as getAllNotesService,
  getNoteById as getNoteByIdService,
  getNotesByOwnerId as getNotesByOwnerIdService,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService,
  searchNotes as searchNotesService,
  getNotesByOwnerAndLectureId,
} from '../services/NoteService.js';

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { content, lecture_id, position, created_at, transcript_id, page_index } =
      req.body;
    const { userId } = req;

    // Validation
    if (!userId || !lecture_id || !position) {
      return res.status(400).json({
        success: false,
        message: 'UserId, lecture_id, and position are required',
      });
    }

    // Validate position has x and y
    if (typeof position.x !== 'number' || typeof position.y !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Position must have x and y coordinates (numbers)',
      });
    }

    const result = await createNoteService({
      content,
      owner_id: userId,
      lecture_id,
      position,
      created_at,
      transcript_id,
      page_index,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all notes
export const getAllNotes = async (req, res) => {
  try {
    const result = await getAllNotesService();

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get note by ID
export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const result = await getNoteByIdService(noteId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get notes by owner ID
export const getNotesByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const result = await getNotesByOwnerIdService(ownerId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNoteByOwnerIdAndLectureId = async (req, res) => {
  try {
    const { userId } = req;
    const { lectureId } = req.params;
    console.log('Fetching notes for userID:', userId, 'and lectureId:', lectureId);
    const result = await getNotesByOwnerAndLectureId(userId, lectureId);

    res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Update note
export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { content } = req.body;

    // Validation
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    const result = await updateNoteService(noteId, { content });

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const result = await deleteNoteService(noteId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search notes
export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const result = await searchNotesService(query);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
