const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  // Usually token comes as "Bearer <token>"
  const tokenString = token.split(' ')[1] || token;

  try {
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'super_secret_jwt_token_for_screen_time_app');
    req.user = decoded; // { id, name, role }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  return next();
};

const verifyAdminToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Admin access required' });
        }
    });
};

module.exports = { verifyToken, verifyAdminToken };
