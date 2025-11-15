import Lecture from "../models/Lecture.js";
import FileStorageService from "../services/FileStorageService.js";

export const createLecture = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Missing PDF file" });
    }

    // Upload PDF lên MinIO
    const pdfUrl = await FileStorageService.uploadFile(req.file);

    const lecture = await Lecture.create({
      name,
      pdfUrl,
    });

    res.status(201).json({
      message: "Lecture created",
      data: lecture,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLectures = async (req, res) => {
  try {
    const list = await Lecture.find().sort({ createdAt: -1 });
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
