const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

exports.requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("JWT PAYLOAD =>", decoded); // ADD THIS

    if (decoded.role !== "admin") return res.status(403).json("Admins only");

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

exports.requireTeacher = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "teacher")
      return res.status(403).json("Teachers only");

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};
