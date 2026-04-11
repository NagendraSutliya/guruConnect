const jwt = require("jsonwebtoken");

const verifyToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("No token");

  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.requireAuth = (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    req.user = {
      id: decoded,
      role: decoded.role,
      instituteId: decoded.instituteId,
    };
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

exports.requireAdmin = (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    if (decoded.role !== "admin") {
      return res.status(403).json("Admins only");
    }
    req.user = {
      id: decoded.id,
      role: decoded.role,
      instituteId: decoded.instituteId,
    };
    next();
  } catch (err) {
    return res.status(401).json("Invalid token");
  }
};

exports.requireTeacher = (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    if (decoded.role !== "teacher") {
      return res.status(403).json("Teachers only");
    }
    req.user = {
      id: decoded.id,
      role: decoded.role,
      instituteId: decoded.instituteId, // ✅ IMPORTANT FIX
    };
    next();
  } catch (err) {
    return res.status(401).json("Invalid token");
  }
};

exports.requireStudent = (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    if (decoded.role !== "student")
      return res.status(403).json("Students only");
    req.user = {
      id: decoded.id,
      role: decoded.role,
      instituteId: decoded.instituteId,
    };
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      const decoded = verifyToken(req);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json("Access denied");
      }
      req.user = {
        id: decoded.id,
        role: decoded.role,
        instituteId: decoded.instituteId,
      };
      next();
    } catch (err) {
      return res.status(401).json("Invalid token");
    }
  };
};
