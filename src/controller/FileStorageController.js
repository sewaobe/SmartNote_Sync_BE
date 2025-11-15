import FileStorageService from "../services/FileStorageService.js";

export const uploadFile = async (req, res) => {
  try {
    const { bucket, prefix } = req.body;

    const objectName = await FileStorageService.uploadFile(req.file, prefix);

    res.json({
      message: "Upload success",
      key: objectName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPresignedUrl = async (req, res) => {
  try {
    const { key } = req.params;

    const url = await FileStorageService.getPresignedUrl(key);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
