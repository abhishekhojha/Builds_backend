const jwt = require('jsonwebtoken');
exports.hasRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token not provided" });
    }

    // if (!req.isAuthenticated()) {
    //     return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    // }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      req.user = decoded;
      if (req.user.role != role[0]) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }
      if(!req.user.isEmailVerified){
        return res.status(403).json({ message: "Forbidden: Access denied, Email is not verified" });
      }
      if(req.user.role == "admin" && !req.user.isVerified){
        return res.status(403).json({ message: "Forbidden: Access denied, User is not verified" });
      }
      return next();
    });
  };
};