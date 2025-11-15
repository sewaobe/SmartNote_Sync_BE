// seed.js
import mongoose from 'mongoose';
import teacherModel from './src/models/teacher.model.js';
import studentModel from './src/models/student.model.js';
import classModel from './src/models/class.model.js';

async function seed() {
  try {
    await mongoose.connect(
      'mongodb+srv://dminhnhatn_db_user:vQ2lpuqea4DMQxjG@smartnote-sync-cluster.ccxildg.mongodb.net/smart-note-db',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    console.log('🌱 Connected to MongoDB');

    // CLEAR OLD DATA
    await teacherModel.deleteMany({});
    await studentModel.deleteMany({});
    await classModel.deleteMany({});

    console.log('🧹 Old collections cleared');

    // ---- INSERT TEACHER ----
    const teacher = await teacherModel.create({
      full_name: 'Nguyễn Văn A',
      email: 'teacherA@gv.edu.vn',
      password: '123456789',
      avatar_url: 'https://example.com/avatar/teacherA.png',
      class_ids: [],
    });

    // ---- INSERT STUDENT ----
    const student = await studentModel.create({
      full_name: 'Trần Thị B',
      email: 'studentB@student.edu.vn',
      password: '123456789',
      avatar_url: 'https://example.com/avatar/studentB.png',
      class_ids: [],
      note_ids: [],
    });

    // ---- INSERT CLASS ----
    const classDoc = await classModel.create({
      name: 'Lập Trình Web - Buổi 1',
      teacher_id: teacher._id,
      student_ids: [student._id],
      lecture_ids: [],
    });

    // Update teacher + student to include this class
    await teacherModel.findByIdAndUpdate(teacher._id, {
      $push: { class_ids: classDoc._id },
    });

    await studentModel.findByIdAndUpdate(student._id, {
      $push: { class_ids: classDoc._id },
    });

    console.log('🎓 Class created:', classDoc.name);

    console.log('🌟 SEED COMPLETE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
