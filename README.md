# Smart Inventory - Intelligent Inventory & QR Ordering System

**Smart Inventory** is a premium, state-of-the-art Next.js template built for modern warehouse management, product tracking, and QR-based ordering. It features beautiful dashboards, real-time messaging, secure JWT authorization, and an integrated checkout flow.

---

## ✨ Features & Highlights

### 📊 Comprehensive Dashboards
* **Inventory Overview**: Track stock levels, restock alerts, and category distributions.
* **Analytics**: Real-time sales analytics and product stats.
* **Order Management**: Monitor pending, processing, and completed orders.
* **Restock Queue**: Manage inventory levels and prioritize restock requests.

### 🔌 Real-Time Communications
* **Socket.IO Integration**: Real-time messaging between managers, staff, and admins.
* **Typing Indicators & Presence**: Live user state and active typing feedback.

### 💳 Modern Payment & Checkout Flow
* **QR Ordering System**: Generate dynamic QR codes for products to enable scan-to-checkout flows.
* **Stripe Checkout**: Integrated Sandbox/Production Stripe payment gateway.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 15 (App Router), React 18
* **Styling**: Tailwind CSS v4, DaisyUI v5 (Modern orange & black theme)
* **Real-time Server**: Node.js, Socket.IO
* **Database**: MongoDB (Mongoose schemas)
* **Image Hosting**: Cloudinary
* **AI Assistance**: Gemini API
* **Auth**: Secure JWT and Firebase SDK Integration

---

## 📂 Project Structure

```text
smart-inventory/
├── documentation/            # Buyer HTML docs + folder structure guide
├── docs/                     # Installation, deployment, licensing
├── marketplace-assets/       # ThemeForest screenshots
├── backend/                  # Socket.IO server (optional)
│   └── server/
├── public/                   # Static assets
├── scripts/
└── src/
    ├── app/                  # Next.js App Router (pages + API)
    ├── components/
    │   ├── marketing/        # Homepage sections
    │   ├── blog/             # Blog sections
    │   ├── dashboard/        # Dashboard UI kit
    │   ├── chat/
    │   └── layout/
    ├── configs/              # site.ts
    ├── db/
    ├── firebase/
    ├── lib/
    ├── models/
    └── utils/
```

---

## 🚀 Installation & Setup

Please refer to the comprehensive [Installation and Setup Guide](docs/INSTALLATION_AND_SETUP.md) for full instructions.

For **live demo deployment** (Vercel + MongoDB Atlas), see [Deployment Guide](docs/DEPLOYMENT.md).

Buyer HTML documentation is included in the `documentation/` folder (`documentation/index.html`).

---

## 📄 License & Credits

* **Fonts**: Google Fonts (Inter, Hind Siliguri)
* **Icons**: [Lucide React](https://lucide.dev)
* **Images**: High-quality open-source stock photography (Unsplash)
* **Libraries**: Next.js, Tailwind CSS, DaisyUI, Socket.IO, Stripe, Mongoose

---

*Thank you for choosing Smart Inventory! For support, please consult the docs folder.*
