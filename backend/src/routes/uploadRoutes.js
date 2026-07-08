const express = require('express');
const { uploadDocument, uploadMultiple } = require('../controllers/uploadController');
const { protect } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

const router = express.Router();

router.use(protect);

router.post('/single', upload.single('file'), uploadDocument);
router.post('/multiple', upload.array('files', 5), uploadMultiple);

module.exports = router;
