// models/student.model.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    avatar_url: { type: String, default: null },

    class_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],

    note_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model('Student', studentSchema);
