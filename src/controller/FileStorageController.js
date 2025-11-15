import FileStorageService from "../services/FileStorageService.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Missing file" });
    }

    const fileKey = await FileStorageService.uploadFile(req.file);
    const presignedUrl = await FileStorageService.getPresignedUrl(fileKey);

    res.json({
      message: "Upload success",
      data: {
        fileKey,
        fileName: req.file.originalname,
        fileUrl: presignedUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPresignedUrl = async (req, res) => {
  try {
    const { key } = req.params;

    const url = await FileStorageService.getPresignedUrl(key);
    if (!url) {
      return res.status(400).json({ error: "Cannot generate presigned URL" });
    }

    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
