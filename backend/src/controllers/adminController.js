const User = require('../models/User');
const Product = require('../models/Product');
const ServiceRecord = require('../models/ServiceRecord');
const ErrorResponse = require('../utils/errorResponse');

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalServices = await ServiceRecord.countDocuments();

    // Check for documents uploaded by seeing if invoice/manual URLs exist
    const productsWithDocs = await Product.find({
      $or: [
        { 'documents.invoice.url': { $exists: true } },
        { 'documents.manual.url': { $exists: true } }
      ]
    });
    const totalDocuments = productsWithDocs.length; // Simplified count

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalServices,
        totalDocuments
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Also delete user's products and services
    await Product.deleteMany({ user: user._id });
    await ServiceRecord.deleteMany({ user: user._id });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
