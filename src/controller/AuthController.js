import Teacher from '../models/teacher.model.js';
import Student from '../models/student.model.js';
import { generateToken } from '../middleware/jwt.middleware.js';

// Login endpoint - trả về JWT token
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    // Tìm trong Teacher
    let user = await Teacher.findOne({ email });
    let userType = 'teacher';

    // Nếu không tìm thấy, tìm trong Student
    if (!user) {
      user = await Student.findOne({ email });
      userType = 'student';
    }

    // Kiểm tra user tồn tại và password đúng
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // So sánh password (trong thực tế nên dùng bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Tạo JWT token
    const token = generateToken(user._id.toString(), userType);

    res.json({
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          userType,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user info từ JWT token
export const getCurrentUser = async (req, res) => {
  try {
    const { userId, userType } = req; // Từ JWT middleware

    let user;

    if (userType === 'teacher') {
      user = await Teacher.findById(userId).select('-password');
    } else if (userType === 'student') {
      user = await Student.findById(userId).select('-password');
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User retrieved successfully',
      data: {
        user,
        userType,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
