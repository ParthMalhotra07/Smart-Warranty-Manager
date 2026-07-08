@echo off
git init
git config user.name "Parth Malhotra"
git config user.email "parthmalhotra905@gmail.com"

git add .gitignore
git commit -m "Initial project setup and configs"

git add backend/package.json backend/server.js backend/src/config/ backend/src/models/User.js backend/src/controllers/authController.js backend/src/routes/authRoutes.js backend/src/middlewares/
git commit -m "Implemented backend user authentication and JWT"

git add backend/src/models/Product.js backend/src/models/ServiceRecord.js backend/src/controllers/productController.js backend/src/controllers/serviceRecordController.js backend/src/routes/productRoutes.js backend/src/routes/serviceRecordRoutes.js
git commit -m "Added product schemas and REST APIs"

git add backend/src/controllers/uploadController.js backend/src/controllers/ocrController.js backend/src/routes/uploadRoutes.js backend/src/routes/ocrRoutes.js backend/src/utils/cloudinary.js
git commit -m "Integrated Gemini AI for OCR invoice parsing and Cloudinary uploads"

git add backend/src/services/ backend/src/utils/sendEmail.js backend/src/models/Notification.js backend/triggerCron.js
git commit -m "Added cron jobs for expiration email notifications"

git add frontend/package.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/index.html frontend/src/main.jsx frontend/src/App.jsx frontend/src/index.css frontend/src/services/
git commit -m "Set up frontend React app with Tailwind CSS and Axios services"

git add frontend/src/components/ frontend/src/pages/Login.jsx frontend/src/pages/ForgotPassword.jsx frontend/src/pages/ResetPassword.jsx
git commit -m "Implemented frontend authentication pages and protected routing"

git add frontend/src/pages/Dashboard.jsx frontend/src/pages/Products.jsx frontend/src/pages/ProductForm.jsx frontend/src/pages/Profile.jsx frontend/src/pages/Notifications.jsx frontend/src/pages/AdminDashboard.jsx
git commit -m "Built dashboard analytics and product management forms"

git add .
git commit -m "Final bug fixes, error handling, and UI polish"

git branch -M main
git remote add origin https://github.com/ParthMalhotra07/Smart-Warranty-Manager.git
echo "Pushing to GitHub... A credential window might pop up if you are not logged in!"
git push -u origin main
