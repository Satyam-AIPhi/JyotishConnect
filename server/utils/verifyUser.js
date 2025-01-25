const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  
  let token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is missing',
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error,
    });
  }
};

module.exports = verifyToken;
