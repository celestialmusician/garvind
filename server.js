/* ==========================================================================
   GARVIND — Parametric 3D Printing Studio Express Backend Server
   ========================================================================== */

const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS & JSON Body Parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
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

// Central Studio Database (In-Memory / JSON File backing)
const PRODUCTS_DATA = [
  {
    id: "dragon-01",
    name: "Articulated Crystal Dragon",
    category: "figure",
    price: 599,
    priceDisplay: "₹599",
    blurb: "Print-in-place, fully poseable joints, mesmerizing scale details.",
    description: "Multi-jointed articulated dragon printed in high-precision layer height. No assembly needed, straight off the heatbed and ready to display or fidget.",
    gradient: ["#2d1138", "#7C5CFC"],
    image: "images/dragon.png",
    shape: "dragon",
    popular: true,
    dimensions: "24cm x 6cm x 4cm",
    printTime: "6.5 hrs",
    materialsAvailable: ["PLA Matte Black", "Silk Gold PLA", "Galaxy Purple PLA", "Neon Mint PLA"],
    colorsAvailable: ["#ffd700", "#7C5CFC", "#3DFFC0", "#FF6B35"]
  },
  {
    id: "keychain-anime",
    name: "Custom Character Keychain",
    category: "keychain",
    price: 149,
    priceDisplay: "₹149",
    blurb: "Pick any anime, gaming, or custom logo silhouette in dual-tone color.",
    description: "Durable dual-layer keychains printed with reinforced eyelets. Weather-resistant PLA finish that holds crisp details.",
    gradient: ["#3a2410", "#FF6B35"],
    image: "images/keychain.png",
    shape: "keychain",
    popular: true,
    dimensions: "5cm x 5cm x 0.4cm",
    printTime: "45 mins",
    materialsAvailable: ["PLA Matte Black", "Silk Gold PLA", "Neon Mint PLA"],
    colorsAvailable: ["#FF6B35", "#3DFFC0", "#ffd700", "#ffffff"]
  },
  {
    id: "planter-geo",
    name: "Low-Poly Geometric Planter",
    category: "decor",
    price: 399,
    priceDisplay: "₹399",
    blurb: "Modern low-poly planter shell with inner drainage tray.",
    description: "Sleek angular geometric succulent planter. Waterproof coated interior with removable bottom drip-tray for easy plant care.",
    gradient: ["#0d2b24", "#3DFFC0"],
    image: "images/planter.png",
    shape: "planter",
    popular: false,
    dimensions: "12cm x 12cm x 10cm",
    printTime: "4 hrs",
    materialsAvailable: ["PLA Matte Black", "Neon Mint PLA", "Silk Gold PLA"],
    colorsAvailable: ["#3DFFC0", "#1a1a22", "#ffd700"]
  },
  {
    id: "armor-vambrace",
    name: "Cosplay Cyber Vambrace",
    category: "prop",
    price: 1299,
    priceDisplay: "₹1,299",
    blurb: "Segmented forearm armor piece, sanded and primer-ready.",
    description: "High-impact PETG/PLA cosplay gauntlet. Ergonomically curved to fit forearms, includes inner strap slots and smooth surface for painting.",
    gradient: ["#241c3d", "#7C5CFC"],
    image: "images/helmet.png",
    shape: "armor",
    popular: true,
    dimensions: "22cm x 10cm x 9cm",
    printTime: "14 hrs",
    materialsAvailable: ["PLA Matte Black", "PETG Durable", "Silk Gold PLA"],
    colorsAvailable: ["#1a1a22", "#7C5CFC", "#ffd700"]
  }
];

const MATERIALS_DATA = [
  { id: "pla-matte", name: "PLA Matte Black", hex: "#1a1a22", roughness: 0.85, metalness: 0.1, density: 1.24, costPerGram: 2.5 },
  { id: "silk-gold", name: "Silk Gold PLA", hex: "#ffd700", roughness: 0.25, metalness: 0.8, density: 1.24, costPerGram: 3.2 },
  { id: "galaxy-purple", name: "Galaxy Purple PLA", hex: "#7C5CFC", roughness: 0.35, metalness: 0.5, density: 1.24, costPerGram: 3.0 },
  { id: "neon-mint", name: "Neon Mint PLA", hex: "#3DFFC0", roughness: 0.30, metalness: 0.3, density: 1.24, costPerGram: 3.0 },
  { id: "tpu-flex", name: "TPU Flexible (Black)", hex: "#2b2b36", roughness: 0.90, metalness: 0.0, density: 1.21, costPerGram: 4.0 },
  { id: "resin-grey", name: "Resin High-Detail", hex: "#8A8A94", roughness: 0.20, metalness: 0.1, density: 1.15, costPerGram: 6.0 }
];

/* ==================== REST API ENDPOINTS ==================== */

// 1. Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    studio: "GARVIND 3D Printing Studio",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. Product Catalog API
app.get("/api/products", (req, res) => {
  const { category, search } = req.query;
  let results = [...PRODUCTS_DATA];

  if (category && category !== "all") {
    results = results.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.blurb.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: results.length, products: results });
});

// 3. Materials Specs API
app.get("/api/materials", (req, res) => {
  res.json({ success: true, materials: MATERIALS_DATA });
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

    const matInfo = MATERIALS_DATA.find(m => m.id === material) || MATERIALS_DATA[0];

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

// 5. Custom Order Brief & Multipart File Upload API
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

    const waText =
`Hi GARVIND! Custom Order Brief (${orderId}):
Name: ${name}
Contact: ${contact}
Category: ${category}
Material: ${material}
File: ${fileInfo ? fileInfo.originalName + ' (' + fileInfo.sizeMB + 'MB)' : 'No file attached'}
Details: ${description}`;

    const num = "919876543210";
    const waUrl = `https://wa.me/${num}?text=${encodeURIComponent(waText)}`;

    res.json({
      success: true,
      orderId: orderId,
      fileUploaded: !!fileInfo,
      fileDetails: fileInfo,
      whatsappUrl: waUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to process custom order" });
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

// Catch-all fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 GARVIND Express Backend Server Running!`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📁 Uploads Dir: ${uploadsDir}`);
  console.log(`==================================================`);
});
