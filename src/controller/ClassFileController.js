import Class from "../models/class.model.js";
import FileStorageService from "../services/FileStorageService.js";

export const uploadClassFile = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Missing file" });
    }

    // Check class exists
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Upload file to S3
    const fileKey = await FileStorageService.uploadFile(req.file);

    // Get presigned URL for download
    const presignedUrl = await FileStorageService.getPresignedUrl(fileKey);

    res.status(201).json({
      message: "File uploaded successfully",
      data: {
        classId,
        fileName: req.file.originalname,
        fileKey,
        fileUrl: presignedUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClassFiles = async (req, res) => {
  try {
    const { classId } = req.params;

    // Check class exists
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({
      message: "Files retrieved successfully",
      data: {
        classId,
        // Note: Cần thêm trường files_ids vào Class schema nếu muốn lưu lại danh sách files
        // Hiện tại chỉ trả về class info
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
