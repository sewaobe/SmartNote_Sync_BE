// models/teacher.model.js
import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model('Teacher', teacherSchema);
