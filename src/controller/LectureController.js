import Lecture from "../models/lecture.model.js";
import Class from "../models/class.model.js";
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

export const getLecturesByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { userId, userType } = req; // Từ JWT middleware

    // Kiểm tra xem class có tồn tại không
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Authorization đơn giản: Kiểm tra xem user có quyền truy cập lớp này không
    if (userType === 'teacher') {
      // Giảng viên chỉ xem được lớp mình dạy
      if (classDoc.teacher_id.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden - You are not the teacher of this class" });
      }
    } else if (userType === 'student') {
      // Học sinh chỉ xem được lớp mình tham gia
      const isStudentInClass = classDoc.student_ids.some(
        (studentId) => studentId.toString() === userId
      );
      if (!isStudentInClass) {
        return res.status(403).json({ message: "Forbidden - You are not a student in this class" });
      }
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Lấy tất cả lecture của lớp này
    const lectures = await Lecture.find({ class_id: classId })
      .sort({ created_at: -1 });

    res.json({
      message: "Lectures retrieved successfully",
      data: lectures,
      userType,
    });
  } catch (err) {
    console.error(err);
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
