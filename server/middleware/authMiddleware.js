const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Access denied. No authorization token provided."
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        msg: "Invalid token format."
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      req.user = decoded;
      next();
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        msg: "Session expired or invalid token. Please log in again."
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal authentication error."
    });
  }
};

module.exports = authMiddleware;