// models/note.model.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

module.exports = mongoose.model('Note', noteSchema);
