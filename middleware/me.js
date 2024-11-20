const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SecretToken = process.env.JWT_SECRET_TOKEN;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).send({ message: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, SecretToken);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
