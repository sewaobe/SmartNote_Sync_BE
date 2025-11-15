// models/summary.model.js
import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema(
  {
    lecture_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: true,
    },

    transcript_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transcript',
      required: true,
    },

    // Full text transcript đầu vào
    full_text: {
      type: String,
      required: true,
    },

    // Bản tóm tắt chính
    summary_text: {
      type: String,
    },

    // Key points (điểm chính của bài học)
    key_points: [
      {
        type: String,
      },
    ],

    // Prompt được sử dụng
    prompt: {
      type: String,
    },

    // Model used
    model_used: {
      type: String,
      default: 'gemini-2.5-flash',
    },

    // Status
    status: {
      type: String,
      enum: ['processing', 'completed', 'error'],
      default: 'processing',
    },

    // Error message nếu có
    error_message: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

// Index
summarySchema.index({ lecture_id: 1, created_at: -1 });
summarySchema.index({ transcript_id: 1 });

export default mongoose.model('Summary', summarySchema);
