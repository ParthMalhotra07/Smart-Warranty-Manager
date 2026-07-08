const cron = require('node-cron');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

const startCronJobs = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily expiry checks...');
    try {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const fifteenDaysFromNow = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const oneDayFromNow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);

      const checkExpiries = async (expiryField, typeName) => {
        const products = await Product.find({
          $or: [
            { [expiryField]: { $gte: new Date(thirtyDaysFromNow.setHours(0,0,0,0)), $lt: new Date(thirtyDaysFromNow.setHours(23,59,59,999)) } },
            { [expiryField]: { $gte: new Date(fifteenDaysFromNow.setHours(0,0,0,0)), $lt: new Date(fifteenDaysFromNow.setHours(23,59,59,999)) } },
            { [expiryField]: { $gte: new Date(sevenDaysFromNow.setHours(0,0,0,0)), $lt: new Date(sevenDaysFromNow.setHours(23,59,59,999)) } },
            { [expiryField]: { $gte: new Date(oneDayFromNow.setHours(0,0,0,0)), $lt: new Date(oneDayFromNow.setHours(23,59,59,999)) } }
          ]
        }).populate('user', 'name email preferences');

        for (let product of products) {
          const user = product.user;
          const daysLeft = Math.ceil((product[expiryField] - today) / (1000 * 60 * 60 * 24));
          
          const message = `Your product ${product.name} (${product.brand}) has its ${typeName} expiring in ${daysLeft} days on ${new Date(product[expiryField]).toLocaleDateString()}.`;
          
          // Create Notification
          await Notification.create({
            user: user._id,
            title: `${typeName} Expiring Soon`,
            message,
            type: typeName.toLowerCase(),
            relatedProduct: product._id
          });

          // Send Email if preferences allow
          if (user.preferences && user.preferences.emailNotifications) {
            try {
              await sendEmail({
                email: user.email,
                subject: `${typeName} Expiry Reminder for ${product.name}`,
                message
              });
            } catch (err) {
              console.error('Email could not be sent', err);
            }
          }
        }
      };

      await checkExpiries('warrantyExpiry', 'Warranty');
      await checkExpiries('insuranceExpiry', 'Insurance');
      await checkExpiries('amcExpiry', 'AMC');
      await checkExpiries('nextServiceDate', 'Service');

    } catch (error) {
      console.error('Error running cron jobs:', error);
    }
  });
};

module.exports = startCronJobs;
