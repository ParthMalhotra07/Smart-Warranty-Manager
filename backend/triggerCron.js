const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./src/models/Product');
const User = require('./src/models/User');
const sendEmail = require('./src/utils/sendEmail');

async function trigger() {
  await mongoose.connect(process.env.MONGO_URI);
  
  try {
    const products = await Product.find().populate('user', 'name email preferences');
    for (let product of products) {
      if (product.user.email === 'parthmalhotra905@gmail.com') {
        const message = `[TEST] Your product ${product.name} (${product.brand}) has an expiry date of ${new Date(product.warrantyExpiry).toLocaleDateString()}. This is a manual test of the email notification system!`;
        console.log(`Sending test email to ${product.user.email}`);
        await sendEmail({
          email: product.user.email,
          subject: `Test Expiry Reminder for ${product.name}`,
          message
        });
        break; // just send one
      }
    }
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

trigger();
