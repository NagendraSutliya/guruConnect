const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const ext = path.extname(file.originalname).toLowerCase();
      let folder = "others";

      if (req.body?.type === "question") {
        folder = "papers";
      } else if (req.body?.type === "answer") {
        folder = "answers";
      } else if (ext === ".txt") {
        folder = "texts";
      }

      const uploadPath = path.join("/uploads", folder);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    } catch (err) {
      console.error("Upload folder error:", err);
      cb(err, "uploads/");
    }
  },

  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + "-" + safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const type = req.body.type;
    // Type-specific rules
    if (type === "question" && file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF allowed for question papers"), false);
    }
    if (
      type === "answer" &&
      !["application/pdf", "image/jpeg", "image/png"].includes(file.mimetype)
    ) {
      return cb(
        new Error("Only PDF or images allowed for answer sheets"),
        false
      );
    }
    if (type === "typed") {
      return cb(new Error("Typed paper should not use file upload"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
