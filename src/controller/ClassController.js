import Class from '../models/class.model.js';
import Teacher from '../models/teacher.model.js';
import Student from '../models/student.model.js';

export const getUserClasses = async (req, res) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(400).json({ message: 'Missing user ID' });
    }

    let classes = [];
    let userType = null;

    const teacher = await Teacher.findById(userId).populate({
      path: 'class_ids',
      model: 'Class',
      populate: [
        { path: 'teacher_id', model: 'Teacher', select: 'full_name email' },
        { path: 'student_ids', model: 'Student', select: 'full_name email' },
      ],
    });

    if (teacher) {
      classes = teacher.class_ids || [];
      userType = 'teacher';
    } else {
      // Tìm trong Student collection
      const student = await Student.findById(userId).populate({
        path: 'class_ids',
        model: 'Class',
        populate: [
          { path: 'teacher_id', model: 'Teacher', select: 'full_name email' },
          { path: 'student_ids', model: 'Student', select: 'full_name email' },
        ],
      });

      if (student) {
        classes = student.class_ids || [];
        userType = 'student';
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    res.json({
      message: 'Classes retrieved successfully',
      data: classes,
      userType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy chi tiết 1 lớp học (tự động kiểm tra quyền)
export const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const { userId } = req;

    const classDoc = await Class.findById(classId)
      .populate('teacher_id', 'full_name email')
      .populate('student_ids', 'full_name email')
      .populate('lecture_ids')
      .populate('file_ids');

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let userType = null;
    let hasAccess = false;

    // Kiểm tra xem user là teacher
    if (classDoc.teacher_id._id.toString() === userId) {
      userType = 'teacher';
      hasAccess = true;
    } else {
      // Kiểm tra xem user là student trong lớp
      const isStudentInClass = classDoc.student_ids.some(
        (student) => student._id.toString() === userId
      );
      if (isStudentInClass) {
        userType = 'student';
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json({
      message: 'Class retrieved successfully',
      data: classDoc,
      userType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
