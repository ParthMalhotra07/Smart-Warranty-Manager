const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    try {
      // Instant confirmation email
      sendEmail({
        email: req.user.email,
        subject: `Product Added: ${product.name}`,
        message: `Success! Your ${product.brand ? product.brand + ' ' : ''}${product.name} has been secured in your vault.`
      }).catch(err => console.error('Failed to send confirmation email:', err));
      
      // Instant expiry check
      if (product.warrantyExpiry) {
        const today = new Date();
        const diffDays = Math.ceil((new Date(product.warrantyExpiry) - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30 && diffDays >= 0) {
          sendEmail({
            email: req.user.email,
            subject: `Warranty Expiry Alert: ${product.name}`,
            message: `Alert: Your ${product.brand ? product.brand + ' ' : ''}${product.name} warranty expires in ${diffDays} days on ${new Date(product.warrantyExpiry).toLocaleDateString()}.`
          }).catch(err => console.error('Failed to send expiry email:', err));
        }
      }
    } catch (emailErr) {
      console.error('Failed to send instant email:', emailErr);
    }

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is product owner
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User not authorized to update this product`, 401));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    try {
      // Instant expiry check on update
      if (product.warrantyExpiry) {
        const today = new Date();
        const diffDays = Math.ceil((new Date(product.warrantyExpiry) - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30 && diffDays >= 0) {
          sendEmail({
            email: req.user.email,
            subject: `Warranty Expiry Alert: ${product.name}`,
            message: `Alert: Your ${product.brand ? product.brand + ' ' : ''}${product.name} warranty expires in ${diffDays} days on ${new Date(product.warrantyExpiry).toLocaleDateString()}.`
          }).catch(err => console.error('Failed to send expiry email:', err));
        }
      }
    } catch (emailErr) {
      console.error('Failed to send instant email:', emailErr);
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User not authorized to delete this product`, 401));
    }
    
    await product.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
