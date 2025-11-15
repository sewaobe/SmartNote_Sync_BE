// models/note.model.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    content: { type: String },

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

    record_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Record',
    },

    page_index: { type: Number },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model('Note', noteSchema);
