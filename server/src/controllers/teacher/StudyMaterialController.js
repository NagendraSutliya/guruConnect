const StudyMaterial = require("../../models/StudyMaterial");
const { successResponse, errorResponse } = require("../../utils/response");
const cloudinary = require("../../config/cloudinary");

// GET all materials
exports.getStudyMaterials = async (req, res) => {
  try {
    const { classId, subjectId, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    let filter = {};
    if (classId) filter.classId = classId;
    if (subjectId) filter.subjectId = subjectId;

    const data = await StudyMaterial.find(filter)
      .populate("classId", "name")
      .populate("subjectId", "name")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await StudyMaterial.countDocuments(filter);

    return successResponse(res, "Study materials fetched", {
      data,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// CREATE material
exports.createStudyMaterial = async (req, res) => {
  try {
    const { title, classId, subjectId } = req.body;

    if (!title || !classId || !subjectId) {
      return errorResponse(res, "All fields are required", 400);
    }

    // ✅ File check
    if (!req.file) {
      return errorResponse(res, "File upload is required", 400);
    }

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          {
            folder: "guruconnect_studymaterial",
            resource_type: "auto",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const cloudinaryResult = await streamUpload(req);

    const studyMaterial = new StudyMaterial({
      title,
      classId,
      subjectId,
      fileUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      fileName: req.file.originalname, 
      fileType: req.file.mimetype, 
      uploadedBy: req.user?.id,
    });

    await studyMaterial.save();

    return successResponse(res, "Study material created", studyMaterial);
  } catch (err) {
    console.error("Study Material Upload Error:", err);
    return errorResponse(res, err.message, 500);
  }
};

// DELETE material
exports.deleteStudyMaterial = async (req, res) => {
  try {
    const studyMaterial = await StudyMaterial.findById(req.params.id);

    if (!studyMaterial) {
      return errorResponse(res, "Material not found", 404);
    }

    // ✅ Delete file from storage
    if (studyMaterial.cloudinaryPublicId) {
       await cloudinary.uploader.destroy(studyMaterial.cloudinaryPublicId, { resource_type: "raw" }).catch(e => console.log(e));
       // Also attempt standard destroy in case it was uploaded as image
       await cloudinary.uploader.destroy(studyMaterial.cloudinaryPublicId).catch(e => console.log(e));
    } else {
       // Fallback for older local files
       const fs = require('fs');
       const path = require('path');
       const filePath = path.join(__dirname, "..", "..", studyMaterial.fileUrl);

       if (fs.existsSync(filePath)) {
         fs.unlink(filePath, (err) => {
           if (err) console.log("File delete error", err);
         });
       }
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);

    return successResponse(res, "Material deleted");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};
