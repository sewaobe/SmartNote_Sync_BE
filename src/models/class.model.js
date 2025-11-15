import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },

    student_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],

    lecture_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
      },
    ],

    file_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassFile',
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model('Class', classSchema);
