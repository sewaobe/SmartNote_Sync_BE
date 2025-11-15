import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },

    title: { type: String, required: true },

    pdf_url: { type: String, required: true },

    total_page: { type: Number, required: true },

    transcript_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transcript',
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

export default mongoose.model('Lecture', lectureSchema);
