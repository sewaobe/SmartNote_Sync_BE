import mongoose from 'mongoose';

// Schema cho mỗi sentence với timestamp
const sentenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  start: { type: Number, required: true }, // milliseconds
  end: { type: Number, required: true }, // milliseconds
  confidence: { type: Number }, // độ tin cậy từ 0-1
  speaker: { type: String }, // nếu có speaker diarization
});

// Schema chính cho transcript
const transcriptSchema = new mongoose.Schema(
  {
    lecture_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: true,
    },

    // AssemblyAI transcript ID để tra cứu sau
    assembly_ai_id: {
      type: String,
      required: true,
      index: true,
    },

    // Audio file info
    audio_url: {
      type: String,
      required: true,
    },

    // Full transcript text (sẽ có sau khi transcription complete)
    full_text: {
      type: String,
      default: '',
    },

    // Sentences với timestamps
    sentences: [sentenceSchema],

    // Metadata từ AssemblyAI
    duration: {
      type: Number, // total duration in milliseconds
    },

    language_code: {
      type: String,
      default: 'vi', // Vietnamese
    },

    // Status của transcription
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'error'],
      default: 'queued',
    },

    // Error message nếu có
    error_message: {
      type: String,
    },

    // Confidence score trung bình
    confidence: {
      type: Number,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

// Index cho tìm kiếm nhanh
transcriptSchema.index({ lecture_id: 1, created_at: -1 });
transcriptSchema.index({ assembly_ai_id: 1 });
transcriptSchema.index({ status: 1 });

export default mongoose.model('Transcript', transcriptSchema);
