/* ==========================================================================
   GARVIND — Parametric 3D Printing Studio Express Backend Server
   ========================================================================== */

const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Razorpay Instance (Uses ENV keys or demo key placeholder)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_demo123456789";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "demo_secret_key_12345";

let razorpayInstance = null;
try {
  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
} catch (e) {
  console.warn("Razorpay initialized in client sandbox mode.");
}

// Enable CORS & JSON Body Parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists (Supports /tmp fallback for serverless Vercel)
let uploadsDir = path.join(__dirname, "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  uploadsDir = path.join("/tmp", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

// Multer Storage Engine Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `garvind-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(stl|obj|3mf|png|jpg|jpeg)$/i;
    if (allowedTypes.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Only .stl, .obj, .3mf, .png, .jpg files are allowed!"));
    }
  }
});

/* ==================== REST API ENDPOINTS ==================== */

// 1. Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    studio: "GARVIND 3D Printing Studio",
    database: "SQLite (database.sqlite)",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. Product Catalog API (Queried directly from SQL Database)
app.get("/api/products", (req, res) => {
  try {
    const { category, search } = req.query;
    const products = db.getProducts({ category, search });
    res.json({ success: true, count: products.length, products: products });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to query products database" });
  }
});

// 3. Materials Specs API (Queried directly from SQL Database)
app.get("/api/materials", (req, res) => {
  try {
    const materials = db.getMaterials();
    res.json({ success: true, count: materials.length, materials: materials });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to query materials database" });
  }
});

// 4. Server-Side 3D Slicing Calculator API
app.post("/api/quote", (req, res) => {
  try {
    const { length, width, height, material, infill, quantity } = req.body;

    const x = Math.max(1, parseFloat(length) || 8);
    const y = Math.max(1, parseFloat(width) || 6);
    const z = Math.max(1, parseFloat(height) || 5);
    const infillPct = Math.max(10, parseInt(infill) || 20);
    const qty = Math.max(1, parseInt(quantity) || 1);

    const materials = db.getMaterials();
    const matInfo = materials.find(m => m.id === material) || materials[0];

    const boundingVolume = x * y * z;
    const shellRatio = 0.25;
    const effectiveVolume = boundingVolume * (shellRatio + (1 - shellRatio) * (infillPct / 100));

    const weightPerUnit = Math.round(effectiveVolume * matInfo.density);
    const totalWeight = weightPerUnit * qty;

    const printHoursPerUnit = (effectiveVolume * 0.08) + (z * 0.15);
    const totalHours = parseFloat((printHoursPerUnit * qty).toFixed(1));

    const materialCost = totalWeight * matInfo.costPerGram;
    const machineTimeCost = totalHours * 25;
    const estimatedPrice = Math.max(99 * qty, Math.round(materialCost + machineTimeCost));

    res.json({
      success: true,
      quote: {
        dimensions: `${x}cm x ${y}cm x ${z}cm`,
        material: matInfo.name,
        infill: `${infillPct}%`,
        quantity: qty,
        estimatedWeightGram: totalWeight,
        estimatedPrintHours: totalHours,
        estimatedPriceINR: estimatedPrice,
        formattedPrice: `₹${estimatedPrice}`
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid slice estimation inputs" });
  }
});

// 5. Custom Order Brief & Multipart File Upload API (Inserted into SQL Orders Table)
app.post("/api/custom-order", upload.single("file"), (req, res) => {
  try {
    const { name, contact, category, material, description } = req.body;
    const uploadedFile = req.file;

    const orderId = "GV-" + Math.floor(100000 + Math.random() * 900000);

    const fileInfo = uploadedFile ? {
      originalName: uploadedFile.originalname,
      filename: uploadedFile.filename,
      sizeMB: (uploadedFile.size / (1024 * 1024)).toFixed(2),
      path: `/uploads/${uploadedFile.filename}`
    } : null;

    // Save record to persistent SQLite database
    const savedRecord = db.createOrder({
      orderId: orderId,
      name: name || "Anonymous",
      contact: contact || "Not provided",
      category: category || "General 3D Print",
      material: material || "PLA Matte Black",
      description: description || "No notes provided",
      filePath: fileInfo ? fileInfo.path : null,
      fileOriginalName: fileInfo ? fileInfo.originalName : null,
      fileSizeMB: fileInfo ? fileInfo.sizeMB : null
    });

    const waText =
`Hi GARVIND! Custom Order Brief (${orderId}):
Name: ${name}
Contact: ${contact}
Category: ${category}
Material: ${material}
File: ${fileInfo ? fileInfo.originalName + ' (' + fileInfo.sizeMB + 'MB)' : 'No file attached'}
Details: ${description}`;

    const num = process.env.WHATSAPP_NUMBER || "917594943335";
    const waUrl = `https://wa.me/${num}?text=${encodeURIComponent(waText)}`;

    res.json({
      success: true,
      order: savedRecord,
      whatsappUrl: waUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to process custom order" });
  }
});

// 6. Orders Retrieval API
app.get("/api/orders", (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, count: orders.length, orders: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to retrieve orders" });
  }
});

// 7. Order Status Update API
app.patch("/api/orders/:id", (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status);
    res.json({ success: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update order status" });
  }
});

// 8. Razorpay Payment: Create Order API
app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    const amountInPaise = Math.round((parseFloat(amount) || 100) * 100);

    let razorpayOrderId = "order_" + Math.random().toString(36).substring(2, 15);

    if (razorpayInstance && process.env.RAZORPAY_KEY_ID) {
      const order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`
      });
      razorpayOrderId = order.id;
    }

    res.json({
      success: true,
      keyId: RAZORPAY_KEY_ID,
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: currency
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to create Razorpay order" });
  }
});

// 9. Razorpay Payment: Verify Payment Signature API
app.post("/api/razorpay/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_db_id } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature || RAZORPAY_KEY_ID.includes("demo");

    if (isAuthentic && order_db_id) {
      db.updateOrderStatus(order_db_id, "Paid");
    }

    res.json({
      success: isAuthentic,
      paymentId: razorpay_payment_id,
      verified: isAuthentic
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Payment verification failed" });
  }
});

/* ==================== STATIC FILES & ROUTING ==================== */

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Serve root static website directory
app.use(express.static(__dirname));

// Route handlers for HTML pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/shop", (req, res) => res.sendFile(path.join(__dirname, "shop.html")));
app.get("/calculator", (req, res) => res.sendFile(path.join(__dirname, "calculator.html")));
app.get("/custom", (req, res) => res.sendFile(path.join(__dirname, "custom.html")));
app.get("/gallery", (req, res) => res.sendFile(path.join(__dirname, "gallery.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "admin.html")));

// Catch-all fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 GARVIND Express Backend Server Running!`);
  console.log(`🗄️ Database: SQLite (database.sqlite)`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📁 Uploads Dir: ${uploadsDir}`);
  console.log(`==================================================`);
});
