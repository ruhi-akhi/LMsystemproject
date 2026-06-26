# Smart Inventory - Installation & Setup Guide

This guide details the step-by-step instructions required to set up and run the **Smart Inventory Management System** (both Frontend Next.js app and Backend Socket Server).

---

## 📋 System Prerequisites

Ensure you have the following installed on your machine:
* **Node.js** (v18.x or v20.x recommended)
* **MongoDB** (Local instance or MongoDB Atlas cloud URI)
* **npm** (v9.x+) or **yarn**

---

## 🛠️ Phase 1: Environment Variables Configuration

Create a `.env.local` file in the root directory of the project and add the following parameters. Replace the dummy values with your actual service credentials.

```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-inventory

# JWT (Authentication Settings)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Payment Gateways (Stripe Sandbox)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloud Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Models (Gemini API Integration)
GEMINI_API_KEY=AIzaSy...

# Mail Transporter (Gmail SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password

# Authentication Providers (GitHub OAuth)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Firebase Configurations (Frontend SDK)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:12345:web:abcde

# Real-Time WebSocket Server
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
SOCKET_PORT=4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Phase 2: Local Installation

### 1. Install Dependencies
Run the install command in the root folder to download all required node modules:
```bash
npm install
```

### 2. Set Up Socket.IO Backend Server
The real-time messaging engine resides in the `backend/server` folder. Navigate to it and install dependencies:
```bash
cd backend/server
npm install
```

Create a `.env.local` inside `backend/server` with the shared DB connection:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-inventory
SOCKET_PORT=4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 💻 Running the Application

To run the application locally, you will need to start two processes: the Backend WebSocket server and the Next.js Frontend.

### Start the WebSocket Server
```bash
cd backend/server
npm run dev
```
*(Runs on http://localhost:4000)*

### Start the Next.js App
In a new terminal window at the project root:
```bash
npm run dev
```
*(Runs on http://localhost:3000)*

---

## 🚢 Production Deployment

For production deployment, we recommend:
1. **Frontend**: Deploy on [Vercel](https://vercel.com) (native Next.js optimization). Set all environment variables starting with `NEXT_PUBLIC_` and others in the project settings.
2. **Backend Server**: Deploy on a cloud service like [Railway](https://railway.app), [Heroku](https://heroku.com), or [Render](https://render.com). Ensure the port is correctly mapped and the socket client on the frontend references the live URL.
3. **Database**: Use a clustered [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) deployment.
