import TranscriptionService from '../services/TranscriptionService.js';
import FileStorageService from '../services/FileStorageService.js';
import Lecture from '../models/lecture.model.js';

/**
 * Upload audio file và tạo transcription
 * POST /api/transcription/upload/:lectureId
 */
export const uploadAndTranscribe = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { page_index } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Missing audio file' });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    const fileKey = await FileStorageService.uploadFile(req.file);
    const audioUrl = await FileStorageService.getPresignedUrl(fileKey);

    const transcript = await TranscriptionService.transcribeAudio(
      audioUrl,
      lectureId,
      page_index ? parseInt(page_index) : null,
    );

    res.status(201).json({
      message: 'Audio uploaded and transcription started',
      data: {
        transcript_id: transcript._id,
        status: transcript.status,
        audio_url: audioUrl,
        lecture_id: lectureId,
      },
    });
  } catch (error) {
    console.error('Error in uploadAndTranscribe:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy tất cả transcripts của một lecture
 * GET /api/transcription/lecture/:lectureId
 */
export const getTranscriptsByLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    const transcripts =
      await TranscriptionService.getTranscriptsByLecture(lectureId);

    res.json({
      message: 'Success',
      data: transcripts,
      count: transcripts.length,
    });
  } catch (error) {
    console.error('Error in getTranscriptsByLecture:', error);
    res.status(500).json({ error: error.message });
  }
};