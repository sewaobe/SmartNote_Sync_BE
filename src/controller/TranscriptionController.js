import TranscriptionService from '../services/TranscriptionService.js';
import FileStorageService from '../services/FileStorageService.js';
import Lecture from '../models/lecture.model.js';
import Transcript from '../models/transcript.model.js';

/**
 * Tạo transcript record trước khi upload
 * POST /api/transcription/start/:lectureId
 */
export const startTranscription = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    const transcript = await TranscriptionService.createTranscript(
      lectureId,
    );

    res.status(201).json({
      message: 'Transcript created successfully',
      data: {
        transcript_id: transcript._id,
        status: transcript.status,
        lecture_id: lectureId,
      },
    });
  } catch (error) {
    console.error('Error in startTranscription:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload audio file và update transcription
 * POST /api/transcription/upload/:transcriptId
 */
export const uploadAndTranscribe = async (req, res) => {
  try {
    const { transcriptId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'Missing audio file' });
    }

    const fileKey = await FileStorageService.uploadFile(req.file);
    const audioUrl = await FileStorageService.getPresignedUrl(fileKey);

    const transcript = await TranscriptionService.uploadAndStartTranscription(
      transcriptId,
      audioUrl,
    );

    if (!transcript) {
      return res.status(404).json({ message: 'Transcript not found' });
    }

    res.status(200).json({
      message: 'Audio uploaded and transcription started',
      data: {
        transcript_id: transcript._id,
        status: transcript.status,
        audio_url: audioUrl,
        lecture_id: transcript.lecture_id,
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

    const transcripts = await TranscriptionService.getTranscriptsByLecture(lectureId);

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

/**
 * Update current page index của lecture
 * PUT /api/transcription/:lectureId/currentPageIndex
 */
export const updateCurrentPageIndex = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { currentPageIndex } = req.body;

    if (currentPageIndex === undefined || currentPageIndex === null) {
      return res.status(400).json({ message: 'currentPageIndex is required' });
    }

    if (typeof currentPageIndex !== 'number' || currentPageIndex < 0) {
      return res.status(400).json({ message: 'currentPageIndex must be a non-negative number' });
    }

    const lecture = await Lecture.findByIdAndUpdate(
      lectureId,
      { currentPageIndex },
      { new: true }
    );

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    res.json({
      message: 'Current page index updated successfully',
      data: {
        lecture_id: lecture._id,
        currentPageIndex: lecture.currentPageIndex,
      },
    });
  } catch (error) {
    console.error('Error in updateCurrentPageIndex:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get current page index của lecture
 * Trả về currentPageIndex nếu có transcript đang ở status 'queued', ngược lại trả về -1
 * GET /api/transcription/:lectureId/currentPageIndex
 */
export const getCurrentPageIndex = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Lấy tất cả transcripts của lecture này
    const transcripts = await Transcript.find({
      lecture_id: lectureId,
    });

    if (transcripts.length === 0) {
      return res.status(404).json({ message: 'No transcripts found for this lecture' });
    }

    // Kiểm tra xem có transcript nào đang ở trạng thái 'queued' hay không
    const hasQueuedTranscript = transcripts.some(t => t.status === 'queued');

    // Lấy lecture để lấy currentPageIndex
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    res.json({
      message: 'Success',
      data: {
        currentPageIndex: hasQueuedTranscript ? lecture.currentPageIndex : -1,
        lecture_id: lecture._id,
      },
    });
  } catch (error) {
    console.error('Error in getCurrentPageIndex:', error);
    res.status(500).json({ error: error.message });
  }
};
