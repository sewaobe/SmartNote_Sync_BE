// services/NoteService.js
import Note from '../models/note.model.js';

// Create a new note
export const createNote = async (noteData) => {
  try {
    const note = new Note(noteData);
    await note.save();
    return {
      success: true,
      data: note,
      message: 'Note created successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// Get all notes
export const getAllNotes = async () => {
  try {
    const notes = await Note.find()
      .populate('owner_id', 'name email')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: notes,
      message: 'Notes retrieved successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// Get note by ID
export const getNoteById = async (noteId) => {
  try {
    const note = await Note.findById(noteId).populate('owner_id', 'name email');

    if (!note) {
      return {
        success: false,
        message: 'Note not found',
      };
    }

    return {
      success: true,
      data: note,
      message: 'Note retrieved successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// Get notes by owner ID
export const getNotesByOwnerId = async (ownerId) => {
  try {
    const notes = await Note.find({ owner_id: ownerId })
      .populate('owner_id', 'name email')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: notes,
      message: 'Notes retrieved successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getNotesByOwnerAndLectureId = async (ownerId, lectureId) => {
  try {
    console.log(
      'NoteService - getNotesByOwnerAndLectureId called with ownerId:',
      ownerId,
      'lectureId:',
      lectureId,
    );
    const notes = await Note.find({ owner_id: ownerId, lecture_id: lectureId })
      .populate('owner_id', 'name email')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: notes,
      message: 'Notes retrieved successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Update note
export const updateNote = async (noteId, updateData) => {
  try {
    const note = await Note.findByIdAndUpdate(noteId, updateData, {
      new: true,
      runValidators: true,
    }).populate('owner_id', 'name email');

    if (!note) {
      return {
        success: false,
        message: 'Note not found',
      };
    }

    return {
      success: true,
      data: note,
      message: 'Note updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// Delete note
export const deleteNote = async (noteId) => {
  try {
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return {
        success: false,
        message: 'Note not found',
      };
    }

    return {
      success: true,
      message: 'Note deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// Search notes by content
export const searchNotes = async (searchQuery) => {
  try {
    const notes = await Note.find({
      content: { $regex: searchQuery, $options: 'i' },
    })
      .populate('owner_id', 'name email')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: notes,
      message: 'Search completed successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
