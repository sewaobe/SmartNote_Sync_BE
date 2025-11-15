// services/SummaryService.js
import { GoogleGenAI } from '@google/genai';
import Summary from '../models/summary.model.js';
import Note from '../models/note.model.js';

// Init SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // SDK mới sẽ tự đọc từ ENV
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2s

// Prompt template
const SUMMARY_PROMPT = `
Bạn là một giáo viên giỏi. Hãy phân tích nội dung bài học sau và trả về JSON:

{
  "summary": "string",
  "key_points": ["string"],
}

Nội dung bài học:
---
{FULL_TEXT}
---

Ghi chú của học sinh:
---
{NOTES_CONTEXT}
---
`;

// Hàm trích xuất JSON từ Gemini
function extractJsonFromText(text) {
  let match = text.match(/```json([\s\S]*?)```/i);
  if (match && match[1]) return match[1].trim();

  match = text.match(/```([\s\S]*?)```/i);
  if (match && match[1]) return match[1].trim();

  match = text.match(/{[\s\S]*}/);
  if (match) return match[0];

  throw new Error('Gemini không trả JSON thuần.');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const generateSummary = async (lectureId, transcriptId, fullText, userId) => {
  let summaryDoc = null;

  try {
    // 1. Fetch user's notes for personalization
    let notesContext = '';
    if (userId) {
      try {
        const userNotes = await Note.find({
          owner_id: userId,
          lecture_id: lectureId,
        }).select('content position');

        if (userNotes && userNotes.length > 0) {
          notesContext = userNotes
            .map(
              (note) => `• ${note.content} (vị trí: x=${note.position?.x}, y=${note.position?.y})`,
            )
            .join('\n');
        }
      } catch (noteErr) {
        console.warn('Failed to fetch user notes:', noteErr.message);
        notesContext = 'Không có ghi chú từ học sinh.';
      }
    } else {
      notesContext = 'Không có thông tin học sinh.';
    }

    // 2. Create summary record
    summaryDoc = await Summary.create({
      lecture_id: lectureId,
      transcript_id: transcriptId,
      full_text: fullText,
      prompt: SUMMARY_PROMPT,
      status: 'processing',
      model_used: 'gemini-2.5-flash',
    });

    // 3. Replace placeholders in prompt
    let prompt = SUMMARY_PROMPT.replace('{FULL_TEXT}', fullText).replace(
      '{NOTES_CONTEXT}',
      notesContext,
    );

    let result = null;
    let lastError = null;

    // 4. Retry loop
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${MAX_RETRIES}...`);

        // SDK mới — generateContent
        result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,

          generationConfig: {
            responseMimeType: 'application/json', // bắt buộc để parse JSON
          },
        });

        break; // success
      } catch (err) {
        lastError = err;

        console.error(`Attempt ${attempt} failed:`, err.message);

        // 429 → exponential backoff
        if (err.message.includes('429')) {
          const delay = RETRY_DELAY * attempt + Math.random() * 500;
          console.log(`Rate limit. Retry in ${delay / 1000}s`);
          await sleep(delay);
        } else {
          await sleep(RETRY_DELAY);
        }
      }
    }

    // 5. Nếu vẫn không thành công → throw
    if (!result) throw lastError || new Error('No response from Gemini');

    // 6. Parse JSON output
    const raw = result.candidates[0].content.parts[0].text;

    const extractedJsonString = extractJsonFromText(raw);

    let parsed;

    try {
      parsed = JSON.parse(extractedJsonString);
    } catch (err) {
      console.error('JSON parse failed:', extractedJsonString);
      throw new Error('JSON parse error: ' + err.message);
    }

    // 7. Update summary doc
    summaryDoc.summary_text = parsed.summary || '';
    summaryDoc.key_points = parsed.key_points || [];
    summaryDoc.status = 'completed';

    await summaryDoc.save();

    return {
      success: true,
      data: summaryDoc,
    };
  } catch (err) {
    console.error('Summary Error:', err);

    if (summaryDoc) {
      summaryDoc.status = 'error';
      summaryDoc.error_message = err.message;
      await summaryDoc.save();
    }

    return { success: false, message: err.message };
  }
};

// ========== GET SUMMARY BY LECTURE ==========
export const getSummaryByLectureId = async (lectureId) => {
  try {
    const summary = await Summary.findOne({ lecture_id: lectureId })
      .populate('lecture_id', 'title pdf_url')
      .populate('transcript_id', 'full_text')
      .sort({ created_at: -1 });

    if (!summary) {
      return { success: false, message: 'Summary not found' };
    }

    return { success: true, data: summary };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// ========== GET ALL SUMMARIES ==========
export const getAllSummaries = async () => {
  try {
    const summaries = await Summary.find()
      .populate('lecture_id', 'title')
      .populate('transcript_id')
      .sort({ created_at: -1 });

    return { success: true, data: summaries };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// ========== GET SUMMARY BY ID ==========
export const getSummaryById = async (summaryId) => {
  try {
    const summary = await Summary.findById(summaryId)
      .populate('lecture_id', 'title pdf_url')
      .populate('transcript_id');

    if (!summary) {
      return { success: false, message: 'Summary not found' };
    }

    return { success: true, data: summary };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// ========== DELETE SUMMARY ==========
export const deleteSummary = async (summaryId) => {
  try {
    const summary = await Summary.findByIdAndDelete(summaryId);

    if (!summary) {
      return { success: false, message: 'Summary not found' };
    }

    return { success: true, message: 'Summary deleted' };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
