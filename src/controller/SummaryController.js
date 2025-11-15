// controllers/SummaryController.js
import {
  generateSummary as SummaryServiceGenerate,
  getSummaryByLectureId as SummaryServiceGetByLecture,
  getAllSummaries as SummaryServiceGetAll,
  getSummaryById as SummaryServiceGetOne,
  deleteSummary as SummaryServiceDelete,
} from '../services/SummaryService.js';

export const generateSummary = async (req, res) => {
  try {
    const { lecture_id, transcript_id, full_text } = req.body;
    const { userId, userType } = req; // Extract from middleware

    if (!lecture_id || !transcript_id || !full_text) {
      return res.status(400).json({
        success: false,
        message: 'lecture_id, transcript_id, and full_text required',
      });
    }

    const result = await SummaryServiceGenerate(
      lecture_id,
      transcript_id,
      full_text,
      userId, // Pass userId to service
    );

    return res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSummaryByLecture = async (req, res) => {
  const result = await SummaryServiceGetByLecture(req.params.lectureId);
  return res.status(result.success ? 200 : 404).json(result);
};

export const getAllSummaries = async (req, res) => {
  const result = await SummaryServiceGetAll();
  return res.status(200).json(result);
};

export const getSummaryById = async (req, res) => {
  const result = await SummaryServiceGetOne(req.params.summaryId);
  return res.status(result.success ? 200 : 404).json(result);
};

export const deleteSummary = async (req, res) => {
  const result = await SummaryServiceDelete(req.params.summaryId);
  return res.status(result.success ? 200 : 404).json(result);
};
