// // models/record.model.js
// import mongoose from 'mongoose';

// const recordSchema = new mongoose.Schema(
//   {
//     lecture_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Lecture',
//       required: true,
//     },

//     transcript: { type: String, required: true },

//     page_index: { type: Number, required: true },

//     uploaded_at: { type: Date, default: Date.now },

//     audio_url: { type: String, required: true },
//   },
//   {
//     timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
//   },
// );

// export default mongoose.model('Record', recordSchema);
