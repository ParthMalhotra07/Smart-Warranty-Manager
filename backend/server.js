const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./src/config/db');
const errorHandler = require('./src/middlewares/error');
const startCronJobs = require('./src/services/cronJob');

// Route files
const auth = require('./src/routes/authRoutes');
const products = require('./src/routes/productRoutes');
const services = require('./src/routes/serviceRecordRoutes');
const uploads = require('./src/routes/uploadRoutes');
const ocr = require('./src/routes/ocrRoutes');
const admin = require('./src/routes/adminRoutes');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Connect to DB
connectDB();

// Start Cron Jobs
startCronJobs();

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/products', products);
app.use('/api/v1/services', services);
app.use('/api/v1/uploads', uploads);
app.use('/api/v1/ocr', ocr);
app.use('/api/v1/admin', admin);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
