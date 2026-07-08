const ServiceRecord = require('../models/ServiceRecord');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

exports.getServiceRecords = async (req, res, next) => {
  try {
    if (req.params.productId) {
      const records = await ServiceRecord.find({ product: req.params.productId, user: req.user.id });
      return res.status(200).json({ success: true, count: records.length, data: records });
    }
    const records = await ServiceRecord.find({ user: req.user.id }).populate('product', 'name brand');
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

exports.addServiceRecord = async (req, res, next) => {
  try {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new ErrorResponse(`No product with the id of ${req.params.productId}`, 404));
    }
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User not authorized to add a service record to this product`, 401));
    }

    const record = await ServiceRecord.create(req.body);

    // Update product last service date
    product.lastServiceDate = record.date;
    await product.save();

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

exports.updateServiceRecord = async (req, res, next) => {
  try {
    let record = await ServiceRecord.findById(req.params.id);
    if (!record) {
      return next(new ErrorResponse(`No service record with the id of ${req.params.id}`, 404));
    }
    if (record.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User not authorized to update this service record`, 401));
    }

    record = await ServiceRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

exports.deleteServiceRecord = async (req, res, next) => {
  try {
    const record = await ServiceRecord.findById(req.params.id);
    if (!record) {
      return next(new ErrorResponse(`No service record with the id of ${req.params.id}`, 404));
    }
    if (record.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User not authorized to delete this service record`, 401));
    }

    await record.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
