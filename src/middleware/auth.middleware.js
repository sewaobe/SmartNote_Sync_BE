import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware xác thực bằng JWT - lấy userId từ token
export const authMiddleware = (req, res, next) => {
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

    // Lưu user info vào request từ JWT
    req.userId = decoded.userId;
    req.userType = decoded.userType;

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};
