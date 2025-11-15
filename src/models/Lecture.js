import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    pdfUrl: {
      type: String,
      required: true, // link được lưu từ FileStorageService (MinIO / S3 / GCP...)
    },

    // Optional: lưu metadata nếu cần
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Optional: tags, description...
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", LectureSchema);
export default Lecture;
