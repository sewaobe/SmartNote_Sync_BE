import { AssemblyAI } from 'assemblyai';
import Transcript from '../models/transcript.model.js';

class TranscriptionService {
  constructor() {
    this.client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY,
    });
  }

  /**
   * Tạo transcript record trước khi upload
   * @param {string} lectureId - ID của lecture
   * @param {number} pageIndex - Index của trang PDF (optional)
   * @returns {Promise<Object>} Transcript document
   */
  async createTranscript(lectureId, pageIndex = null) {
    try {
      const transcriptDoc = await Transcript.create({
        lecture_id: lectureId,
        audio_url: '',
        assembly_ai_id: '',
        full_text: '',
        sentences: [],
        status: 'queued',
      });

      return transcriptDoc;
    } catch (error) {
      console.error('Error creating transcript:', error);
      throw error;
    }
  }

  /**
   * Upload audio và bắt đầu transcription cho transcript đã tạo
   * @param {string} transcriptId - ID của transcript
   * @param {string} audioUrl - URL của audio file (từ MinIO/S3)
   * @returns {Promise<Object>} Updated transcript document
   */
  async uploadAndStartTranscription(transcriptId, audioUrl) {
    try {
      const transcriptDoc = await Transcript.findById(transcriptId);
      if (!transcriptDoc) {
        throw new Error('Transcript not found');
      }

      // Submit transcription request tới AssemblyAI
      const params = {
        audio: audioUrl,
        language_code: 'vi', // Vietnamese
        // Có thể enable speaker diarization nếu cần
        // speaker_labels: true,
      };

      const transcript = await this.client.transcripts.submit(params);

      // Update transcript record với audio URL và AssemblyAI ID
      transcriptDoc.audio_url = audioUrl;
      transcriptDoc.assembly_ai_id = transcript.id;
      transcriptDoc.status = 'processing';
      await transcriptDoc.save();

      // Bắt đầu polling để lấy kết quả
      this.pollTranscript(transcript.id, transcriptDoc._id);

      return transcriptDoc;
    } catch (error) {
      console.error('Error uploading and starting transcription:', error);
      throw error;
    }
  }

  /**
   * Upload audio file và bắt đầu transcription (legacy - giữ lại để backward compatible)
   * @param {string} audioUrl - URL của audio file (từ MinIO/S3)
   * @param {string} lectureId - ID của lecture
   * @param {number} pageIndex - Index của trang PDF (optional)
   * @returns {Promise<Object>} Transcript document
   */
  async transcribeAudio(audioUrl, lectureId, pageIndex = null) {
    try {
      // Submit transcription request tới AssemblyAI trước
      const params = {
        audio: audioUrl,
        language_code: 'vi', // Vietnamese
        // Có thể enable speaker diarization nếu cần
        // speaker_labels: true,
      };

      // Submit và không đợi (async processing)
      const transcript = await this.client.transcripts.submit(params);

      // Tạo transcript record trong DB với AssemblyAI ID
      const transcriptDoc = await Transcript.create({
        lecture_id: lectureId,
        audio_url: audioUrl,
        assembly_ai_id: transcript.id,
        full_text: '',
        sentences: [],
        status: 'processing',
        page_index: pageIndex,
      });

      // Bắt đầu polling để lấy kết quả
      this.pollTranscript(transcript.id, transcriptDoc._id);

      return transcriptDoc;
    } catch (error) {
      console.error('Error submitting transcription:', error);
      throw error;
    }
  }

  /**
   * Polling để lấy kết quả transcription từ AssemblyAI
   * @param {string} assemblyAiId - AssemblyAI transcript ID
   * @param {string} transcriptDocId - MongoDB document ID
   */
  async pollTranscript(assemblyAiId, transcriptDocId) {
    try {
      // Wait until transcription is ready
      const result = await this.client.transcripts.waitUntilReady(
        assemblyAiId,
        {
          pollingInterval: 3000, // 3 seconds
          pollingTimeout: 300000, // 5 minutes timeout
        },
      );

      if (result.status === 'error') {
        // Update với error status
        await Transcript.findByIdAndUpdate(transcriptDocId, {
          status: 'error',
          error_message: result.error,
        });
        return;
      }

      // Lấy sentences với timestamps
      const sentences = await this.client.transcripts.sentences(assemblyAiId);

      // Transform sentences data
      const sentencesData = sentences.sentences.map((sentence) => ({
        text: sentence.text,
        start: sentence.start,
        end: sentence.end,
        confidence: sentence.confidence,
        speaker: sentence.speaker || null,
      }));

      // Update transcript document
      await Transcript.findByIdAndUpdate(transcriptDocId, {
        status: 'completed',
        full_text: result.text,
        sentences: sentencesData,
        duration: result.audio_duration * 1000, // convert to milliseconds
        language_code: result.language_code,
        confidence: result.confidence,
      });

      console.log(
        `✅ Transcription completed for transcript ${transcriptDocId}`,
      );
    } catch (error) {
      console.error('Error polling transcript:', error);
      await Transcript.findByIdAndUpdate(transcriptDocId, {
        status: 'error',
        error_message: error.message,
      });
    }
  }

  /**
   * Lấy tất cả transcripts của một lecture
   * @param {string} lectureId - Lecture ID
   * @returns {Promise<Array>} Array of transcript documents
   */
  async getTranscriptsByLecture(lectureId) {
    return await Transcript.find({ lecture_id: lectureId })
      .sort({ created_at: -1 });
  }
}

export default new TranscriptionService();
