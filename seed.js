// seed.js
const mongoose = require('mongoose');
const teacherModel = require('./src/models/teacher.model');
const studentModel = require('./src/models/student.model');

// IMPORT MODELS

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/smartnote', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🌱 Connected to MongoDB');

    // CLEAR OLD DATA
    await teacherModel.deleteMany({});
    await studentModel.deleteMany({});

    console.log('🧹 Old collections cleared');

    // ---- INSERT TEACHER ----
    const teacher = await teacherModel.create({
      full_name: 'Nguyễn Văn A',
      email: 'teacherA@gv.edu.vn',
      password: '123456789',
      avatar_url: 'https://example.com/avatar/teacherA.png',
    });

    const student = await studentModel.create({
      full_name: 'Trần Thị B',
      email: 'studentB@student.edu.vn',
      password: '123456789',
      avatar_url: 'https://example.com/avatar/studentB.png',
      class_ids: [],
    });

    console.log('🌟 SEED COMPLETE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
