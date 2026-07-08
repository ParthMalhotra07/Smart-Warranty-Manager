const express = require('express');
const { extractInvoiceData } = require('../controllers/ocrController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.post('/extract', extractInvoiceData);

module.exports = router;
