const jwt = require('jsonwebtoken');

exports.hasRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token not provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      req.user = decoded;

      // Check if user's role is in the allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      // Email verification check
      if (!req.user.isEmailVerified) {
        return res.status(403).json({ message: "Forbidden: Email not verified" });
      }

      // Additional check for admin
      if (req.user.role === "admin" && !req.user.isVerified) {
        return res.status(403).json({ message: "Forbidden: Admin not verified" });
      }

      return next();
    });
  };
};