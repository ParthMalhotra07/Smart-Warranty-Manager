const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a service date']
  },
  cost: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  workshop: String,
  remarks: String,
  invoiceUrl: String,
  invoicePublicId: String
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
