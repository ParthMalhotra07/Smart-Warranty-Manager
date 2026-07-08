const ErrorResponse = require('../utils/errorResponse');

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }
    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        publicId: req.file.filename
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload files', 400));
    }
    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));
    res.status(200).json({
      success: true,
      data: uploadedFiles
    });
  } catch (err) {
    next(err);
  }
};
