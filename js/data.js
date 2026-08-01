/* ==========================================================================
   GARVIND — Content & Studio Data
   Centralized configuration and product database for GARVIND 3D Printing Studio.
   ========================================================================== */

// Central Studio Config — edit phone number here to update everywhere!
const CONFIG = {
  studioName: "GARVIND",
  tagline: "Custom 3D Printing Studio — Keychains, Figurines, Props & Desk Decor",
  whatsappNumber: "919876543210", // Change to your real WhatsApp number (country code + number, no + or spaces)
  email: "hello@garvind.in",
  location: "Thiruvananthapuram, Kerala, India",
  instagramUrl: "https://www.instagram.com/garv_ind",
  currency: "₹",
  turnaroundAvgHours: 48,
  minLayerHeight: 0.1,
  maxLayerHeight: 0.3
};

// Filament Materials & Colorways
const MATERIALS = [
  { id: "pla-matte", name: "PLA Matte Black", hex: "#1a1a22", roughness: 0.85, metalness: 0.1, density: 1.24, costPerGram: 2.5 },
  { id: "silk-gold", name: "Silk Gold PLA", hex: "#ffd700", roughness: 0.25, metalness: 0.8, density: 1.24, costPerGram: 3.2 },
  { id: "galaxy-purple", name: "Galaxy Purple PLA", hex: "#7C5CFC", roughness: 0.35, metalness: 0.5, density: 1.24, costPerGram: 3.0 },
  { id: "neon-mint", name: "Neon Mint PLA", hex: "#3DFFC0", roughness: 0.30, metalness: 0.3, density: 1.24, costPerGram: 3.0 },
  { id: "tpu-flex", name: "TPU Flexible (Black)", hex: "#2b2b36", roughness: 0.90, metalness: 0.0, density: 1.21, costPerGram: 4.0 },
  { id: "resin-grey", name: "Resin High-Detail", hex: "#8A8A94", roughness: 0.20, metalness: 0.1, density: 1.15, costPerGram: 6.0 }
];

// Product Catalog
const PRODUCTS = [
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
  },
  {
    id: "grid-organizer",
    name: "Modular Desk Grid Tray",
    category: "decor",
    price: 449,
    priceDisplay: "₹449",
    blurb: "Interlocking desktop organizer — stack, snap, rearrange.",
    description: "Clean grid system designed to keep pens, cables, tools, and SD cards organized. Snap-fit joints allow custom layout expansion.",
    gradient: ["#241109", "#FF6B35"],
    shape: "grid",
    popular: false,
    dimensions: "15cm x 15cm x 5cm",
    printTime: "5 hrs",
    materialsAvailable: ["PLA Matte Black", "Neon Mint PLA"],
    colorsAvailable: ["#FF6B35", "#1a1a22", "#3DFFC0"]
  },
  {
    id: "figure-chibi",
    name: "Custom Chibi Mini Figure",
    category: "figure",
    price: 699,
    priceDisplay: "₹699",
    blurb: "Send a photo, we slice and print a mini stylized figure of you.",
    description: "High-resolution resin or fine-layer PLA mini sculpture. Great personalized gift for birthdays, gaming setups, or desk decoration.",
    gradient: ["#12241f", "#3DFFC0"],
    shape: "chibi",
    popular: true,
    dimensions: "8cm x 5cm x 5cm",
    printTime: "5.5 hrs",
    materialsAvailable: ["Resin High-Detail", "PLA Matte Black", "Silk Gold PLA"],
    colorsAvailable: ["#8A8A94", "#ffd700", "#7C5CFC"]
  },
  {
    id: "tag-nameplate",
    name: "Custom Name Plate & Tag",
    category: "keychain",
    price: 99,
    priceDisplay: "₹99",
    blurb: "Custom name or phone number tag with raised typography.",
    description: "Pocket-sized identification tag or desk badge. Pick custom text, font style, and dual contrast colors.",
    gradient: ["#241c3d", "#7C5CFC"],
    shape: "tag",
    popular: false,
    dimensions: "7cm x 2.5cm x 0.5cm",
    printTime: "30 mins",
    materialsAvailable: ["PLA Matte Black", "Neon Mint PLA", "Silk Gold PLA"],
    colorsAvailable: ["#7C5CFC", "#FF6B35", "#3DFFC0"]
  },
  {
    id: "helmet-shell",
    name: "Cosplay Helmet Shell Part",
    category: "prop",
    price: 2199,
    priceDisplay: "₹2,199",
    blurb: "Multi-part structural print with alignment key joints.",
    description: "Full-scale wearable headgear shell. Split into interlocking precision parts for easy assembly, sanding, and foam lining.",
    gradient: ["#0d2b24", "#3DFFC0"],
    shape: "helmet",
    popular: true,
    dimensions: "28cm x 24cm x 26cm",
    printTime: "28 hrs",
    materialsAvailable: ["PETG Durable", "PLA Matte Black"],
    colorsAvailable: ["#1a1a22", "#3DFFC0", "#7C5CFC"]
  },
  {
    id: "custom-print",
    name: "Custom STL Print Request",
    category: "custom",
    price: 0,
    priceDisplay: "Custom Quote",
    blurb: "Have an STL file or a photo? Send it for an instant quote.",
    description: "Upload your CAD file, Thingiverse link, or sketch. We analyze printability, recommend material, slice, and send a precise price estimate.",
    gradient: ["#1a1a22", "#8A8A94"],
    shape: "question",
    popular: true,
    dimensions: "Any custom size",
    printTime: "Varies",
    materialsAvailable: ["PLA", "PETG", "TPU Flexible", "Resin"],
    colorsAvailable: ["#FF6B35", "#7C5CFC", "#3DFFC0", "#ffd700", "#1a1a22"]
  }
];

// FAQs
const FAQS = [
  {
    q: "How fast do custom prints ship?",
    a: "Small keychains and tags usually ship within 24 to 48 hours. Larger figurines or multi-part cosplay props take 3 to 5 days depending on print time. You get an exact dispatch date with your WhatsApp quote."
  },
  {
    q: "What if I don't have a 3D model (.STL file)?",
    a: "No problem at all! Send us a reference photo, sketch, or link from Thingiverse/Printables. If a 3D model doesn't exist yet, we offer custom 3D modeling as part of your request."
  },
  {
    q: "Which filament material should I choose?",
    a: "PLA is ideal for keychains, desk decor, and figurines. PETG offers higher strength and heat resistance for functional parts. TPU is rubber-like and flexible. Resin delivers ultra-fine detail for miniature sculptures."
  },
  {
    q: "Do you ship nationwide across India?",
    a: "Yes! All prints are securely bubble-wrapped, boxed, and shipped across India with tracking details sent directly to your WhatsApp."
  },
  {
    q: "What is your layer height accuracy?",
    a: "We print down to 0.1mm layer height for fine detail, and 0.2mm for strong structural prints. Every part undergoes post-print inspection and support removal before dispatch."
  }
];

// Customer Reviews
const REVIEWS = [
  { name: "Aditi R.", location: "Bengaluru", stars: "★★★★★", text: "Ordered a custom keychain with my dog's silhouette — came out cleaner than I expected. Super quick response on WhatsApp!" },
  { name: "Kevin M.", location: "Kochi", stars: "★★★★★", text: "The cosplay vambrace fit perfectly and the finish was smooth enough to paint straight away. Highly recommend GARVIND!" },
  { name: "Sana T.", location: "Thiruvananthapuram", stars: "★★★★★", text: "Desk organizer grid is exactly what my workspace needed. Clean print lines and solid feel." },
  { name: "Rahul P.", location: "Mumbai", stars: "★★★★★", text: "Got a custom chibi figure made from a photo. Didn't think 3D printing could capture that detail so accurately." },
  { name: "Vikram S.", location: "Chennai", stars: "★★★★★", text: "Printed a replacement mechanical bracket in PETG. Precise dimensions and super tough material." }
];

// Instagram @garv_ind Showcase Tiles
const INSTA_TILES = [
  { id: 1, title: "Articulated Dragon", category: "Silk Gold PLA", tag: "#3dprinting", gradient: ["#3a2410", "#FF6B35"], image: "images/dragon.png", link: "https://www.instagram.com/garv_ind" },
  { id: 2, title: "Anime Keychains", category: "Dual-Color Print", tag: "#animeart", gradient: ["#241c3d", "#7C5CFC"], image: "images/keychain.png", link: "https://www.instagram.com/garv_ind" },
  { id: 3, title: "Voronoi Planter", category: "Matte Black PLA", tag: "#homedecor", gradient: ["#0d2b24", "#3DFFC0"], image: "images/planter.png", link: "https://www.instagram.com/garv_ind" },
  { id: 4, title: "Cyber Armor Prop", category: "PETG High-Impact", tag: "#cosplayprop", gradient: ["#2d1138", "#7C5CFC"], image: "images/helmet.png", link: "https://www.instagram.com/garv_ind" },
  { id: 5, title: "Chibi Mini Figure", category: "Resin High Detail", tag: "#customgift", gradient: ["#12241f", "#3DFFC0"], image: "images/dragon.png", link: "https://www.instagram.com/garv_ind" },
  { id: 6, title: "Desk Cable Clip Set", category: "TPU Flexible", tag: "#desksetup", gradient: ["#241109", "#FF6B35"], image: "images/planter.png", link: "https://www.instagram.com/garv_ind" }
];
