# GARVIND — Parametric 3D Printing Studio Web Application

A modern, high-performance web platform and Express backend server for **GARVIND 3D Printing Studio**. Features a dynamic 3D WebGL background, transparent glowing cursor, multi-page layout, instant slicing calculator, drag-and-drop custom order briefs, SQLite database, Studio Admin Dashboard, and Razorpay payment gateway integration.

---

## 🌟 Key Features

- **3D Parametric WebGL Canvas**: Three.js background canvas synced with viewport scrolling and color swatches.
- **Multi-Page Layout**:
  - `index.html` — Studio showcase & featured prints.
  - `shop.html` — Catalog with category filters & Quick View modal.
  - `calculator.html` — Instant price estimator & slicing calculator.
  - `custom.html` — Custom project order request with drag & drop `.STL` file dropzone.
  - `gallery.html` — Instagram showcase, customer reviews, & FAQs.
  - `admin.html` — Studio Admin Dashboard (`/admin`) to inspect customer briefs, download `.STL` files, update statuses, and launch WhatsApp chats.
- **Express Backend & REST APIs (`server.js`)**:
  - `GET /api/products` — Product catalog API.
  - `GET /api/materials` — Filament materials & cost API.
  - `POST /api/quote` — Server-side 3D slicing calculation engine.
  - `POST /api/custom-order` — Multipart `.STL` / `.OBJ` file upload handler using `multer`.
  - `GET /api/orders` & `PATCH /api/orders/:id` — Order status management.
  - `POST /api/razorpay/create-order` & `POST /api/razorpay/verify-payment` — Razorpay online payment integration.
- **SQLite Database (`db.js`)**: Persistent storage for products, materials, and customer order briefs in `database.sqlite`.
- **Razorpay Payment Gateway**: Online payment via Google Pay, PhonePe, Paytm, BHIM UPI, Cards, NetBanking, and Wallets.

---

## 🚀 One-Click Online Hosting & Deployment Guide

### Option 1: Deploying to Render (Recommended - Free Tier)

1. Sign in to [Render](https://render.com/).
2. Click **New +** → select **Web Service**.
3. Connect your GitHub repository: `https://github.com/celestialmusician/garvind.git`.
4. Render will automatically detect `render.yaml` configuration!
5. Add your live Environment Variables under **Environment**:
   - `RAZORPAY_KEY_ID`: Your live Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your live Razorpay Key Secret
   - `WHATSAPP_NUMBER`: Your business WhatsApp number (e.g. `919876543210`)
6. Click **Deploy Web Service**. Your website is live online with a free SSL certificate!

---

### Option 2: Deploying to Railway

1. Sign in to [Railway](https://railway.app/).
2. Click **New Project** → select **Deploy from GitHub repo**.
3. Choose `celestialmusician/garvind`.
4. Add environment variables (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `WHATSAPP_NUMBER`).
5. Railway will automatically execute `npm start` (using `Procfile`).

---

### Option 3: Deploying to Vercel

1. Install Vercel CLI: `npm i -g vercel`.
2. Run `vercel` in your project folder.
3. Vercel will use `vercel.json` to deploy your Express server as a serverless web app.

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/celestialmusician/garvind.git
cd garvind

# 2. Install dependencies
npm install

# 3. Start local development server
npm start
```

Open **`http://localhost:8080`** in your browser!  
Admin Dashboard: **`http://localhost:8080/admin`** *(Passkey: `garvind2026`)*

---

## 📄 License
ISC License © GARVIND Studio
