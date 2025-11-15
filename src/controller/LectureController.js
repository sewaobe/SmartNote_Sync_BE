import Lecture from "../models/lecture.model.js";
import FileStorageService from "../services/FileStorageService.js";

export const createLecture = async (req, res) => {
  try {
    const { classId } = req.params;
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Missing PDF file" });
    }

    if (!title) {
      return res.status(400).json({ message: "Missing title" });
    }

    if (!classId) {
      return res.status(400).json({ message: "Missing classId" });
    }

    // Upload PDF to S3
    const pdf_url = await FileStorageService.uploadFile(req.file);

    const lecture = await Lecture.create({
      class_id: classId,
      title,
      pdf_url,
      total_page: 1, // Default, có thể update sau
    });

    res.status(201).json({
      message: "Lecture created successfully",
      data: lecture,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLectures = async (req, res) => {
  try {
    const list = await Lecture.find().sort({ created_at: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: "Not found" });

    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);
    if (!lecture) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted", data: lecture });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
