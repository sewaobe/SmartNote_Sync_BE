// models/lecture.model.js
const mongoose = require('mongoose');

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

    record_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record',
      },
    ],

    time_attempt_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeAttempt',
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

module.exports = mongoose.model('Lecture', lectureSchema);
