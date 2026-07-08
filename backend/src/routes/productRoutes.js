const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middlewares/auth');

// Include other resource routers
const serviceRouter = require('./serviceRecordRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:productId/services', serviceRouter);

router.use(protect);

router
  .route('/')
  .get(getProducts)
  .post(createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
