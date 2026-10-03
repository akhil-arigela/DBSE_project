const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized! Invalid token.' });
  }
};

module.exports = { verifyToken };
