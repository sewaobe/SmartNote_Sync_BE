import Lecture from "../models/lecture.model.js";
import Class from "../models/class.model.js";
import FileStorageService from "../services/FileStorageService.js";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";

const WEBHOOK_URL = "http://localhost:5678/webhook-test/f88088e9-6b88-4572-80bb-55bef57d0f79";
const QUESTION_WEBHOOK_URL = "http://localhost:5678/webhook-test/0be91f5b-a868-4a6b-a8a5-e51f5ca6e1a5";

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

    // Gọi webhook với file upload
    try {
      const form = new FormData();
      console.log("calling webhook...");
      form.append("data", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
      await axios.post(WEBHOOK_URL, form, {
        headers: form.getHeaders(),
      });
      
      console.log("Webhook called successfully");
    } catch (webhookErr) {
      console.error("Webhook error:", webhookErr.message);
      // Tiếp tục không dừng lại, chỉ log error
    }

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

export const callQuestionWebhook = async (req, res) => {
  try {
    const { lectureId, question } = req.body;

    console.log("callQuestionWebhook called with:", { lectureId, question });

    if (!lectureId || !question) {
      return res.status(400).json({ 
        message: "Missing required fields: lectureId, question" 
      });
    }

    // Gọi webhook với lectureId và question
    const payload = {
      lectureId,
      question,
    };

    console.log("Calling webhook with payload:", JSON.stringify(payload, null, 2));
    console.log("Webhook URL:", QUESTION_WEBHOOK_URL);

    try {
      const response = await axios.post(QUESTION_WEBHOOK_URL, payload, {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Webhook response status:", response.status);
      console.log("Webhook response received:", response.data);
      
      res.status(200).json({
        message: "Webhook called successfully",
        data: response.data,
      });
    } catch (webhookErr) {
      console.error("Question webhook error type:", webhookErr.code);
      console.error("Question webhook error message:", webhookErr.message);
      console.error("Question webhook error response:", webhookErr.response?.status, webhookErr.response?.data);
      
      res.status(500).json({
        message: "Webhook call failed",
        error: webhookErr.message,
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
