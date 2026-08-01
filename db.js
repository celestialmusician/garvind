/* ==========================================================================
   GARVIND — SQLite Database Module & Schema Initialization
   ========================================================================== */

const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

// Enable foreign keys & WAL mode for speed and performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/* ---------------- Table Initialization ---------------- */
function initDatabase() {
  // 1. Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      priceDisplay TEXT NOT NULL,
      blurb TEXT NOT NULL,
      description TEXT NOT NULL,
      gradient TEXT NOT NULL,
      image TEXT,
      shape TEXT NOT NULL,
      popular INTEGER DEFAULT 0,
      dimensions TEXT NOT NULL,
      printTime TEXT NOT NULL,
      materialsAvailable TEXT NOT NULL,
      colorsAvailable TEXT NOT NULL
    );
  `);

  // 2. Materials Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      hex TEXT NOT NULL,
      roughness REAL NOT NULL,
      metalness REAL NOT NULL,
      density REAL NOT NULL,
      costPerGram REAL NOT NULL
    );
  `);

  // 3. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      category TEXT NOT NULL,
      material TEXT NOT NULL,
      description TEXT NOT NULL,
      filePath TEXT,
      fileOriginalName TEXT,
      fileSizeMB TEXT,
      status TEXT DEFAULT 'Pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}

/* ---------------- Initial Data Seeding ---------------- */
function seedInitialData() {
  const productCount = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
  if (productCount === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, category, price, priceDisplay, blurb, description, gradient, image, shape, popular, dimensions, printTime, materialsAvailable, colorsAvailable)
      VALUES (@id, @name, @category, @price, @priceDisplay, @blurb, @description, @gradient, @image, @shape, @popular, @dimensions, @printTime, @materialsAvailable, @colorsAvailable)
    `);

    const initialProducts = [
      {
        id: "dragon-01",
        name: "Articulated Crystal Dragon",
        category: "figure",
        price: 599,
        priceDisplay: "₹599",
        blurb: "Print-in-place, fully poseable joints, mesmerizing scale details.",
        description: "Multi-jointed articulated dragon printed in high-precision layer height. No assembly needed, straight off the heatbed and ready to display or fidget.",
        gradient: JSON.stringify(["#2d1138", "#7C5CFC"]),
        image: "images/dragon.png",
        shape: "dragon",
        popular: 1,
        dimensions: "24cm x 6cm x 4cm",
        printTime: "6.5 hrs",
        materialsAvailable: JSON.stringify(["PLA Matte Black", "Silk Gold PLA", "Galaxy Purple PLA", "Neon Mint PLA"]),
        colorsAvailable: JSON.stringify(["#ffd700", "#7C5CFC", "#3DFFC0", "#FF6B35"])
      },
      {
        id: "keychain-anime",
        name: "Custom Character Keychain",
        category: "keychain",
        price: 149,
        priceDisplay: "₹149",
        blurb: "Pick any anime, gaming, or custom logo silhouette in dual-tone color.",
        description: "Durable dual-layer keychains printed with reinforced eyelets. Weather-resistant PLA finish that holds crisp details.",
        gradient: JSON.stringify(["#3a2410", "#FF6B35"]),
        image: "images/keychain.png",
        shape: "keychain",
        popular: 1,
        dimensions: "5cm x 5cm x 0.4cm",
        printTime: "45 mins",
        materialsAvailable: JSON.stringify(["PLA Matte Black", "Silk Gold PLA", "Neon Mint PLA"]),
        colorsAvailable: JSON.stringify(["#FF6B35", "#3DFFC0", "#ffd700", "#ffffff"])
      },
      {
        id: "planter-geo",
        name: "Low-Poly Geometric Planter",
        category: "decor",
        price: 399,
        priceDisplay: "₹399",
        blurb: "Modern low-poly planter shell with inner drainage tray.",
        description: "Sleek angular geometric succulent planter. Waterproof coated interior with removable bottom drip-tray for easy plant care.",
        gradient: JSON.stringify(["#0d2b24", "#3DFFC0"]),
        image: "images/planter.png",
        shape: "planter",
        popular: 0,
        dimensions: "12cm x 12cm x 10cm",
        printTime: "4 hrs",
        materialsAvailable: JSON.stringify(["PLA Matte Black", "Neon Mint PLA", "Silk Gold PLA"]),
        colorsAvailable: JSON.stringify(["#3DFFC0", "#1a1a22", "#ffd700"])
      },
      {
        id: "armor-vambrace",
        name: "Cosplay Cyber Vambrace",
        category: "prop",
        price: 1299,
        priceDisplay: "₹1,299",
        blurb: "Segmented forearm armor piece, sanded and primer-ready.",
        description: "High-impact PETG/PLA cosplay gauntlet. Ergonomically curved to fit forearms, includes inner strap slots and smooth surface for painting.",
        gradient: JSON.stringify(["#241c3d", "#7C5CFC"]),
        image: "images/helmet.png",
        shape: "armor",
        popular: 1,
        dimensions: "22cm x 10cm x 9cm",
        printTime: "14 hrs",
        materialsAvailable: JSON.stringify(["PLA Matte Black", "PETG Durable", "Silk Gold PLA"]),
        colorsAvailable: JSON.stringify(["#1a1a22", "#7C5CFC", "#ffd700"])
      }
    ];

    const seedProductsTransaction = db.transaction((products) => {
      for (const p of products) insertProduct.run(p);
    });
    seedProductsTransaction(initialProducts);
  }

  const materialCount = db.prepare("SELECT COUNT(*) AS count FROM materials").get().count;
  if (materialCount === 0) {
    const insertMaterial = db.prepare(`
      INSERT INTO materials (id, name, hex, roughness, metalness, density, costPerGram)
      VALUES (@id, @name, @hex, @roughness, @metalness, @density, @costPerGram)
    `);

    const initialMaterials = [
      { id: "pla-matte", name: "PLA Matte Black", hex: "#1a1a22", roughness: 0.85, metalness: 0.1, density: 1.24, costPerGram: 2.5 },
      { id: "silk-gold", name: "Silk Gold PLA", hex: "#ffd700", roughness: 0.25, metalness: 0.8, density: 1.24, costPerGram: 3.2 },
      { id: "galaxy-purple", name: "Galaxy Purple PLA", hex: "#7C5CFC", roughness: 0.35, metalness: 0.5, density: 1.24, costPerGram: 3.0 },
      { id: "neon-mint", name: "Neon Mint PLA", hex: "#3DFFC0", roughness: 0.30, metalness: 0.3, density: 1.24, costPerGram: 3.0 },
      { id: "tpu-flex", name: "TPU Flexible (Black)", hex: "#2b2b36", roughness: 0.90, metalness: 0.0, density: 1.21, costPerGram: 4.0 },
      { id: "resin-grey", name: "Resin High-Detail", hex: "#8A8A94", roughness: 0.20, metalness: 0.1, density: 1.15, costPerGram: 6.0 }
    ];

    const seedMaterialsTransaction = db.transaction((materials) => {
      for (const m of materials) insertMaterial.run(m);
    });
    seedMaterialsTransaction(initialMaterials);
  }
}

// Initialize database tables
initDatabase();

/* ---------------- Export Helper Functions ---------------- */
function getProducts(options = {}) {
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (options.category && options.category !== "all") {
    query += " AND category = ?";
    params.push(options.category);
  }

  if (options.search) {
    query += " AND (name LIKE ? OR blurb LIKE ? OR category LIKE ?)";
    const term = `%${options.search}%`;
    params.push(term, term, term);
  }

  const rows = db.prepare(query).all(...params);
  return rows.map(r => ({
    ...r,
    popular: Boolean(r.popular),
    gradient: JSON.parse(r.gradient),
    materialsAvailable: JSON.parse(r.materialsAvailable),
    colorsAvailable: JSON.parse(r.colorsAvailable)
  }));
}

function getMaterials() {
  return db.prepare("SELECT * FROM materials").all();
}

function createOrder(orderData) {
  const stmt = db.prepare(`
    INSERT INTO orders (orderId, name, contact, category, material, description, filePath, fileOriginalName, fileSizeMB)
    VALUES (@orderId, @name, @contact, @category, @material, @description, @filePath, @fileOriginalName, @fileSizeMB)
  `);
  const info = stmt.run(orderData);
  return { id: info.lastInsertRowid, ...orderData };
}

function getOrders() {
  return db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all();
}

function updateOrderStatus(id, status) {
  const stmt = db.prepare("UPDATE orders SET status = ? WHERE id = ?");
  const info = stmt.run(status, id);
  return info.changes > 0;
}

module.exports = {
  db,
  getProducts,
  getMaterials,
  createOrder,
  getOrders,
  updateOrderStatus
};
