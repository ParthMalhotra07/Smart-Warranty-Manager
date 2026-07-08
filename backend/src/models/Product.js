const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a product name']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  modelNumber: String,
  serialNumber: String,
  purchaseDate: Date,
  purchasePrice: Number,
  warrantyExpiry: Date,
  insuranceExpiry: Date,
  amcExpiry: Date,
  lastServiceDate: Date,
  nextServiceDate: Date,
  sellerName: String,
  sellerContact: String,
  serviceCenter: String,
  notes: String,
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  },
  documents: {
    invoice: {
      url: String,
      publicId: String
    },
    manual: {
      url: String,
      publicId: String
    },
    images: [{
      url: String,
      publicId: String
    }]
  }
}, {
  timestamps: true
});

// Indexes for search and filters
productSchema.index({ user: 1, name: 'text', brand: 'text', category: 'text', serialNumber: 'text', sellerName: 'text' });
productSchema.index({ user: 1, warrantyExpiry: 1 });
productSchema.index({ user: 1, insuranceExpiry: 1 });
productSchema.index({ user: 1, amcExpiry: 1 });
productSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);
