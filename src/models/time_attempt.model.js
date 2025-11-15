// models/time_attempt.model.js
import mongoose from 'mongoose';

const timeAttemptSchema = new mongoose.Schema(
  {
    lecture_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: true,
    },

    started_at: { type: Number, required: true }, // giây

    ended_at: { type: Number, required: true }, // giây

    page_index: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model('TimeAttempt', timeAttemptSchema);
