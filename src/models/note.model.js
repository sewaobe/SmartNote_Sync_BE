// models/note.model.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },

    lecture_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: true,
    },

    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model('Note', noteSchema);
