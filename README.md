# Smart Warranty Manager

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Website-blue?style=for-the-badge)](https://smart-warranty-manager.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)](#)

## Overview
Smart Warranty Manager is a full-stack, enterprise-grade web application designed to solve the common problem of lost appliance warranties, forgotten service schedules, and misplaced documentation. It provides users with a centralized, intelligent dashboard to track the lifecycle of their physical assets.

## The Problem It Solves
Most consumers and businesses lose track of product warranties, appliance manuals, and maintenance schedules. When an appliance breaks, finding the original purchase invoice or determining if it is still under warranty often requires sifting through physical files or disorganized email inboxes. Furthermore, missing routine maintenance (like changing water filters) can lead to costly repairs that void existing warranties.

## The Solution
This platform digitizes and automates the entire appliance lifecycle management process. Users can upload a physical receipt, and the system utilizes intelligent OCR extraction to parse the purchase details automatically. The application securely archives manuals and invoices in the cloud, maintains a financial ledger of repair costs, and proactively dispatches email alerts before warranties expire or service dates approach.

## Core Capabilities
- **Automated Data Extraction:** Integration with Google Gemini AI for optical character recognition (OCR) to automatically extract product details, brands, and purchase dates directly from uploaded invoices.
- **Proactive Notification Engine:** A background chron-job service that scans the database daily and utilizes Nodemailer to dispatch automated email warnings 30, 15, 7, and 1 day prior to warranty expirations or scheduled service dates.
- **Cloud Document Vault:** Secure, permanent storage of PDFs and images (manuals and invoices) utilizing Cloudinary's cloud infrastructure.
- **Service & Financial Tracking:** Comprehensive timeline logging for individual appliance maintenance, allowing users to track lifetime repair costs and service histories.
- **Data Analytics Dashboard:** Real-time aggregation of active warranties, impending service deadlines, and total financial inventory value.
- **Authentication & Security:** Robust user authentication utilizing JSON Web Tokens (JWT), bcrypt password hashing, and secure, time-limited password recovery emails.

## Technical Architecture
### Frontend
- **Framework:** React.js (built with Vite)
- **Styling:** Tailwind CSS
- **State & Data Fetching:** Axios, React Hook Form
- **Routing:** React Router DOM (with protected route middleware)

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB & Mongoose (ODM)
- **Authentication:** JWT & bcrypt
- **Task Scheduling:** Node-Cron
- **File Handling:** Multer

### Integrations
- **Cloudinary:** Remote asset storage
- **Google Gemini 2.0 Flash:** Generative AI for OCR

## Local Development Setup

### 1. Repository Setup
```bash
git clone https://github.com/ParthMalhotra07/Smart-Warranty-Manager.git
cd Smart-Warranty-Manager
```

### 2. Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FROM_NAME="Smart Warranty App"
FROM_EMAIL="noreply@domain.com"
```

### 3. Frontend Configuration
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Initialization
**Terminal 1 (Backend Server):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend Server):**
```bash
cd frontend
npm install
npm run dev
```

## License
This project is available under the MIT License.
