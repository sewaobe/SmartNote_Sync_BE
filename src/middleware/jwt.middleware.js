import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Tạo JWT token
export const generateToken = (userId, userType) => {
  return jwt.sign(
    {
      userId,
      userType, // 'teacher' hoặc 'student'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1]; // Lấy token từ "Bearer token"

    if (!token) {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Lưu user info vào request
    req.userId = decoded.userId;
    req.userType = decoded.userType;

    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};
