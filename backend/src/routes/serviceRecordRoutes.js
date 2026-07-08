const express = require('express');
const {
  getServiceRecords,
  addServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} = require('../controllers/serviceRecordController');

const { protect } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getServiceRecords)
  .post(addServiceRecord);

router
  .route('/:id')
  .put(updateServiceRecord)
  .delete(deleteServiceRecord);

module.exports = router;
