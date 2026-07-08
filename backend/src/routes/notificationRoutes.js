const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.route('/').get(getNotifications);

module.exports = router;
