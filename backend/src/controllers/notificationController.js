const Product = require('../models/Product');

exports.getNotifications = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user.id });
    const notifications = [];
    const today = new Date();
    
    // Generate dynamic notifications
    products.forEach((p) => {
      if (p.warrantyExpiry) {
        const diffDays = Math.ceil((new Date(p.warrantyExpiry) - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30 && diffDays >= 0) {
          notifications.push({
            id: `w-${p._id}`,
            title: 'Warranty Expiring Soon',
            message: `${p.brand || 'Your'} ${p.name} warranty expires in ${diffDays} days.`,
            type: 'warranty',
            date: 'Today',
            isRead: false
          });
        } else if (diffDays < 0) {
          notifications.push({
            id: `we-${p._id}`,
            title: 'Warranty Expired',
            message: `${p.brand || 'Your'} ${p.name} warranty has expired.`,
            type: 'warranty',
            date: 'System',
            isRead: true
          });
        }
      }

      if (p.nextServiceDate) {
        const diffDays = Math.ceil((new Date(p.nextServiceDate) - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30 && diffDays >= 0) {
          notifications.push({
            id: `s-${p._id}`,
            title: 'Upcoming Service',
            message: `${p.brand || 'Your'} ${p.name} is due for service in ${diffDays} days.`,
            type: 'service',
            date: 'Today',
            isRead: false
          });
        } else if (diffDays < 0) {
           notifications.push({
            id: `se-${p._id}`,
            title: 'Overdue Service',
            message: `${p.brand || 'Your'} ${p.name} service is overdue by ${Math.abs(diffDays)} days.`,
            type: 'service',
            date: 'System',
            isRead: false
          });
        }
      }
    });

    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    next(err);
  }
};
